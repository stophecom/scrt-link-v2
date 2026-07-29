import { createDownloadLinkAndClick, sendMessageToServiceWorker } from '$lib/client/utils';
import {
	fileDownloadKey,
	type FilesEnvelope,
	handleFileChunksDownload,
	type SecretFile,
	type SecretFileEntry
} from '$lib/file-transfer';

export type DownloadStatus = 'idle' | 'downloading' | 'done' | 'error';

export type DownloadableFile = SecretFileEntry & {
	progress: number; // 0..1
	status: DownloadStatus;
	error?: string;
};

type FileDownloaderOptions = {
	envelope: FilesEnvelope;
	secretIdHash: string;
	// When set, chunks are authorized against a secret request instead of a secret.
	requestIdHash?: string;
	decryptionKey: string;
};

const POLL_INTERVAL = 250;
// Stop polling after ~30s without the progress number moving. The browser download
// carries on regardless; we just stop waiting on it so a stalled file can't block
// the rest of `downloadAll()`.
const STALLED_POLLS = 120;

/**
 * Drives download + decryption of every file in a secret, tracking progress per file.
 *
 * Small single-chunk files are decrypted in memory and handed to the browser as an
 * object URL. Anything larger is streamed through the service worker, which decrypts
 * chunk by chunk so the file never has to fit in memory.
 */
export class FileDownloader {
	files: DownloadableFile[] = $state([]);

	readonly #bucket: string;
	readonly #secretIdHash: string;
	readonly #requestIdHash?: string;
	readonly #decryptionKey: string;

	constructor({ envelope, secretIdHash, requestIdHash, decryptionKey }: FileDownloaderOptions) {
		this.#bucket = envelope.bucket;
		this.#secretIdHash = secretIdHash;
		this.#requestIdHash = requestIdHash;
		this.#decryptionKey = decryptionKey;

		this.files = envelope.files.map((file) => ({ ...file, progress: 0, status: 'idle' }));
	}

	get totalSize(): number {
		return this.files.reduce((total, file) => total + file.size, 0);
	}

	get isDownloading(): boolean {
		return this.files.some((file) => file.status === 'downloading');
	}

	/** True when a file has to go through the service worker to be downloaded. */
	needsServiceWorker(file: DownloadableFile): boolean {
		return !file.isSingleChunk;
	}

	get requiresServiceWorker(): boolean {
		return this.files.some((file) => this.needsServiceWorker(file));
	}

	#toSecretFile(file: DownloadableFile): SecretFile {
		return {
			id: file.id,
			name: file.name,
			size: file.size,
			mimeType: file.mimeType,
			isSingleChunk: file.isSingleChunk,
			chunks: file.chunks,
			bucket: this.#bucket,
			secretIdHash: this.#secretIdHash,
			requestIdHash: this.#requestIdHash,
			decryptionKey: this.#decryptionKey,
			progress: 0
		};
	}

	/** Polls `readProgress` into `file.progress` until it completes or stalls. */
	#trackProgress(file: DownloadableFile, readProgress: () => Promise<number>): Promise<void> {
		return new Promise((resolve) => {
			let lastProgress = -1;
			let stalledPolls = 0;

			const interval = setInterval(async () => {
				let progress: number;
				try {
					progress = await readProgress();
				} catch {
					clearInterval(interval);
					resolve();
					return;
				}

				// Progress occasionally overshoots slightly.
				file.progress = Math.min(progress, 1);

				if (file.progress >= 1) {
					clearInterval(interval);
					file.status = 'done';
					resolve();
					return;
				}

				stalledPolls = file.progress === lastProgress ? stalledPolls + 1 : 0;
				lastProgress = file.progress;

				if (stalledPolls >= STALLED_POLLS) {
					clearInterval(interval);
					resolve();
				}
			}, POLL_INTERVAL);
		});
	}

	/**
	 * Decrypts a single-chunk file in memory and returns an object URL.
	 * Used for previews (Snap) and for the small-file download path.
	 */
	async toObjectUrl(file: DownloadableFile): Promise<string> {
		const secretFile = this.#toSecretFile(file);
		const response = new Response(handleFileChunksDownload(secretFile));

		const tracking = this.#trackProgress(file, () => Promise.resolve(secretFile.progress));
		const blob = await response.blob();
		file.progress = 1;
		file.status = 'done';
		await tracking;

		return URL.createObjectURL(new File([blob], file.name, { type: file.mimeType }));
	}

	async #streamViaServiceWorker(file: DownloadableFile): Promise<void> {
		const downloadKey = fileDownloadKey(this.#secretIdHash, file.id);
		const secretFile = this.#toSecretFile(file);

		const fileInfo = {
			...secretFile,
			url: `/service-worker-file-download#${encodeURIComponent(downloadKey)}`
		};

		// Ensure that you're not passing anything that could be non-clonable
		await sendMessageToServiceWorker({
			request: 'file_info',
			data: JSON.parse(JSON.stringify(fileInfo))
		});

		createDownloadLinkAndClick(fileInfo.url);

		await this.#trackProgress(file, () =>
			sendMessageToServiceWorker<number>({
				request: 'progress',
				data: { secretIdHash: this.#secretIdHash, id: file.id }
			})
		);
	}

	async download(file: DownloadableFile): Promise<void> {
		if (file.status === 'downloading') {
			return;
		}

		file.status = 'downloading';
		file.progress = 0;
		file.error = undefined;

		try {
			if (file.isSingleChunk) {
				const url = await this.toObjectUrl(file);
				createDownloadLinkAndClick(url, file.name);
				return;
			}

			await this.#streamViaServiceWorker(file);
		} catch (e) {
			file.status = 'error';
			file.error = e instanceof Error ? e.message : String(e);
			throw e;
		}
	}

	/** Downloads every file in sequence, so large streams don't compete for bandwidth. */
	async downloadAll(): Promise<void> {
		for (const file of this.files) {
			try {
				await this.download(file);
			} catch {
				// Already recorded on the file; keep going so one bad file
				// doesn't strand the rest.
			}
		}
	}
}
