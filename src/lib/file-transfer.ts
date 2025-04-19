import axios from 'axios';
import axiosRetry from 'axios-retry';

import { api, asyncPool } from '$lib/api';
import { decryptData, encryptFile, sha256Hash, signMessage } from '$lib/client/web-crypto';

// If the request fails, we retry
axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

type SignedUrlGetResponse = {
	url: string;
};
export type PresignedPostResponse = { url: string; fields: Record<string, string> };

type Chunk = {
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
export type FileReference = {
	bucket: string;
	chunks: Chunk[];
};

export interface SecretFile extends FileMeta, FileReference {
	secretIdHash: string;
	decryptionKey: string;
	progress: number;
}

type HandleFileEncryptionAndUpload = {
	controllers: Map<number, AbortController>;
	file: File;
	masterKey: string;
	privateKey: CryptoKey;
	chunkSize: number;
	progressCallback: (progress: number) => void;
};
export const handleFileEncryptionAndUpload = async ({
	controllers,
	file,
	masterKey,
	privateKey,
	chunkSize,
	progressCallback
}: HandleFileEncryptionAndUpload): Promise<Chunk[]> => {
	const fileSize = file.size;
	const numberOfChunks = typeof chunkSize === 'number' ? Math.ceil(fileSize / chunkSize) : 1;
	const concurrentUploads = Math.min(3, numberOfChunks);
	const progressOfEachChunk: number[] = [];
	progressCallback(0);

	if (!fileSize) {
		throw new Error('Empty file (zero bytes). Please select another file.');
	}

	return asyncPool(concurrentUploads, [...new Array(numberOfChunks).keys()], async (i: number) => {
		const controller = new AbortController();
		const signal = controller.signal;
		controllers.set(i, controller); // Store the controller

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
		}).then(() => {
			controllers.delete(i); // Remove controller after completion
		});

		return {
			key: fileName,
			signature,
			size: chunk.size
		};
	});
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
	bucket,
	chunk
}: Pick<SecretFile, 'secretIdHash' | 'bucket'> & { chunk: Chunk }) => {
	const { key, signature } = chunk;
	const keyHash = await sha256Hash(key);

	const { url } = await api<SignedUrlGetResponse>(
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
	const { secretIdHash, chunks, bucket, decryptionKey } = file;

	let loaded = 0;
	const totalSize = chunks.map((o) => o['size']).reduce((a, b) => a + b);

	const decryptionStream = new ReadableStream({
		async start(controller) {
			// We download the chunks in sequence.
			// We could do concurrent fetching but the order of the chunks in the stream is important.
			for (const chunk of chunks) {
				const response = await chunkDownload({ secretIdHash, bucket, chunk });

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
