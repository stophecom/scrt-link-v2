import { decryptData, encryptFile, sha256Hash, signMessage } from '@scrt-link/core';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { api } from '$lib/api';

// If the request fails, we retry
axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

type SignedUrlGetResponse = {
	url: string;
};
export type PresignedPostResponse = { url: string; fields: Record<string, string> };

export type Chunk = {
	key: string;
	signature: string;
	size: number;
};

export type FileMeta = {
	name: string;
	size: number;
	mimeType: string;
	isSingleChunk: boolean;
};

/**
 * Legacy single-file envelope. Secrets created before multi-file support stored
 * `content` as `{ bucket, chunks }` with the file's name/size/mimeType living in
 * the (separately encrypted) `meta`. Secrets live up to FILE_RETENTION_PERIOD_IN_DAYS,
 * so this shape must stay readable. Only `FilesEnvelope` is ever written.
 */
export type FileReference = {
	bucket: string;
	chunks: Chunk[];
};

/** One file inside a multi-file secret: its meta and its chunk list, kept together. */
export type SecretFileEntry = FileMeta & {
	id: string;
	chunks: Chunk[];
};

/** Current shape of a file secret's decrypted `content`. */
export type FilesEnvelope = {
	bucket: string;
	files: SecretFileEntry[];
};

export interface SecretFile extends SecretFileEntry {
	bucket: string;
	secretIdHash: string;
	// When set, chunk downloads are authorized against a secret request
	// (ECDSA signature verified vs. secret_request.responseFilePublicKey)
	// instead of the secret table.
	requestIdHash?: string;
	decryptionKey: string;
	progress: number;
}

const isFilesEnvelope = (envelope: FilesEnvelope | FileReference): envelope is FilesEnvelope =>
	Array.isArray((envelope as FilesEnvelope).files);

/**
 * Accepts either envelope shape and always returns the multi-file one, so callers
 * never branch on format. For the legacy shape the per-file meta is recovered from
 * the secret's `meta` object, which is where it used to live.
 */
export const normalizeFileEnvelope = (
	envelope: FilesEnvelope | FileReference,
	legacyMeta?: Partial<FileMeta>
): FilesEnvelope => {
	if (isFilesEnvelope(envelope)) {
		return envelope;
	}

	const { bucket, chunks } = envelope;

	return {
		bucket,
		files: [
			{
				// Chunk keys are random UUIDs, unique per upload — a stable id for legacy secrets.
				id: chunks[0]?.key ?? 'legacy-file',
				name: legacyMeta?.name ?? 'secret-file.bin',
				size: legacyMeta?.size ?? totalChunkSize(chunks),
				mimeType: legacyMeta?.mimeType ?? 'application/octet-stream',
				isSingleChunk: legacyMeta?.isSingleChunk ?? chunks.length === 1,
				chunks
			}
		]
	};
};

export const totalChunkSize = (chunks: Chunk[]): number =>
	chunks.reduce((total, chunk) => total + chunk.size, 0);

/**
 * Service worker map key. One download response carries one file, so a secret with
 * several files needs one entry per file rather than one per secret.
 */
export const fileDownloadKey = (secretIdHash: string, fileId: string) =>
	`${secretIdHash}:${fileId}`;

/**
 * Number of chunk uploads in flight at once. Shared across all files of a secret —
 * without a shared limiter, uploading N files would open 3×N connections.
 */
export const UPLOAD_CONCURRENCY = 3;

export type UploadSemaphore = { acquire: () => Promise<() => void> };

export const createUploadSemaphore = (limit: number): UploadSemaphore => {
	let active = 0;
	const waiting: (() => void)[] = [];

	const release = () => {
		active--;
		waiting.shift()?.();
	};

	return {
		acquire: async () => {
			if (active >= limit) {
				await new Promise<void>((resolve) => waiting.push(resolve));
			}
			active++;
			return release;
		}
	};
};

type HandleFileEncryptionAndUpload = {
	// Keyed by `${uploadId}:${chunkIndex}` so concurrent files don't clobber each other.
	controllers: Map<string, AbortController>;
	uploadId: string;
	file: File;
	masterKey: string;
	privateKey: CryptoKey;
	chunkSize: number;
	semaphore?: UploadSemaphore;
	progressCallback: (progress: number) => void;
};
export const handleFileEncryptionAndUpload = async ({
	controllers,
	uploadId,
	file,
	masterKey,
	privateKey,
	chunkSize,
	semaphore,
	progressCallback
}: HandleFileEncryptionAndUpload): Promise<Chunk[]> => {
	const fileSize = file.size;
	const numberOfChunks = Math.ceil(fileSize / chunkSize);
	const progressOfEachChunk: number[] = [];
	progressCallback(0);

	if (!fileSize) {
		throw new Error('Empty file (zero bytes). Please select another file.');
	}

	const slots =
		semaphore ?? createUploadSemaphore(Math.min(UPLOAD_CONCURRENCY, numberOfChunks || 1));

	return Promise.all(
		[...new Array(numberOfChunks).keys()].map(async (i): Promise<Chunk> => {
			const releaseSlot = await slots.acquire();

			const controllerKey = `${uploadId}:${i}`;
			const controller = new AbortController();
			const signal = controller.signal;
			controllers.set(controllerKey, controller); // Store the controller

			try {
				const start = i * chunkSize;
				const end = i + 1 === numberOfChunks ? fileSize : (i + 1) * chunkSize;
				const chunk = file.slice(start, end);

				const encryptedFile = await encryptFile(chunk, masterKey);

				const chunkFileSize = encryptedFile.size;
				const fileName = crypto.randomUUID();
				const signature = await signMessage(fileName, privateKey);

				const fileNameHashed = await sha256Hash(fileName);
				const { url, fields } = await api<PresignedPostResponse>(
					`/secrets/files?file=${fileNameHashed}`
				);

				await uploadFileToS3({
					signal,
					url,
					fields,
					blob: encryptedFile,
					size: chunkFileSize,
					progressCallback: (p) => {
						progressOfEachChunk[i] = p;
						const sum = (progressOfEachChunk.reduce((a, b) => a + b, 0) / numberOfChunks) * 100;
						progressCallback(sum);
					}
				});

				return {
					key: fileName,
					signature,
					size: chunk.size
				};
			} finally {
				controllers.delete(controllerKey); // Remove controller after completion
				releaseSlot();
			}
		})
	);
};

type UploadFileToS3Params = {
	signal: AbortSignal;
	blob: Blob;
	size: number;
	progressCallback: (progress: number) => void;
} & PresignedPostResponse;

export const uploadFileToS3 = async ({
	signal,
	url,
	fields,
	blob,
	size,
	progressCallback
}: UploadFileToS3Params): Promise<void> => {
	progressCallback(0);

	// Prepare form data
	const formData = new FormData();
	Object.entries(fields).forEach(([key, value]) => {
		if (typeof value !== 'string') {
			return;
		}
		formData.append(key, value);
	});

	formData.append('file', blob);

	// Post file to S3
	// Using axios b/c of built-in progress callback
	await axios.request({
		signal,
		method: 'POST',
		url: url,
		data: formData,
		onUploadProgress: (p) => {
			progressCallback(p.loaded / (p.total || size));
		}
	});
};

const chunkDownload = async ({
	secretIdHash,
	requestIdHash,
	bucket,
	chunk
}: Pick<SecretFile, 'secretIdHash' | 'requestIdHash' | 'bucket'> & { chunk: Chunk }) => {
	const { key, signature } = chunk;
	const keyHash = await sha256Hash(key);

	const { url } = requestIdHash
		? await api<SignedUrlGetResponse>(
				`/secret-requests/files/${key}`,
				{ method: 'POST' },
				{ requestIdHash, bucket, keyHash, signature }
			)
		: await api<SignedUrlGetResponse>(
				`/secrets/files/${key}`,
				{ method: 'POST' },
				{ secretIdHash, bucket, keyHash, signature }
			);
	const response = await fetch(url);

	if (!response.ok || !response.body) {
		throw new Error(`Couldn't retrieve file - it may no longer exist.`);
	}
	return response;
};

// Function runs in Service Worker, which means no access to DOM, etc.
export const handleFileChunksDownload = (file: SecretFile) => {
	const { secretIdHash, requestIdHash, chunks, bucket, decryptionKey } = file;

	let loaded = 0;
	const totalSize = totalChunkSize(chunks);

	const decryptionStream = new ReadableStream({
		async start(controller) {
			// We download the chunks in sequence.
			// We could do concurrent fetching but the order of the chunks in the stream is important.
			for (const chunk of chunks) {
				const response = await chunkDownload({ secretIdHash, requestIdHash, bucket, chunk });

				// This stream is for reading the download progress
				const res = new Response(
					new ReadableStream({
						async start(controller) {
							const reader = response.body!.getReader();
							for (;;) {
								const { done, value } = await reader.read();
								if (done) {
									break;
								}
								loaded += value.byteLength;
								file.progress = loaded / totalSize;
								controller.enqueue(value);
							}
							controller.close();
						}
					})
				);

				const encryptedFileChunk = await res.blob();
				const decryptedFileChunk = await decryptData(encryptedFileChunk, decryptionKey);

				controller.enqueue(new Uint8Array(decryptedFileChunk));
			}

			controller.close();
		}
	});

	return decryptionStream;
};

export const getFileExtension = (file: File): string | null => {
	const name = file.name;
	const parts = name.split('.');
	return parts.length > 1 ? (parts.pop()?.toLowerCase() ?? null) : null;
};
