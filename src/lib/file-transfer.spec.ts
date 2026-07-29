import { describe, expect, it } from 'vitest';

import {
	type Chunk,
	createUploadSemaphore,
	fileDownloadKey,
	type FileReference,
	type FilesEnvelope,
	normalizeFileEnvelope,
	totalChunkSize
} from './file-transfer';

const chunk = (key: string, size: number): Chunk => ({ key, signature: `sig-${key}`, size });

describe('normalizeFileEnvelope', () => {
	it('returns a multi-file envelope untouched', () => {
		const envelope: FilesEnvelope = {
			bucket: 'secrets',
			files: [
				{
					id: 'a',
					name: 'one.txt',
					size: 10,
					mimeType: 'text/plain',
					isSingleChunk: true,
					chunks: [chunk('c1', 10)]
				},
				{
					id: 'b',
					name: 'two.txt',
					size: 20,
					mimeType: 'text/plain',
					isSingleChunk: true,
					chunks: [chunk('c2', 20)]
				}
			]
		};

		expect(normalizeFileEnvelope(envelope)).toBe(envelope);
	});

	it('lifts a legacy single-file envelope into the multi-file shape', () => {
		const legacy: FileReference = { bucket: 'secrets', chunks: [chunk('c1', 100)] };

		const result = normalizeFileEnvelope(legacy, {
			name: 'report.pdf',
			size: 100,
			mimeType: 'application/pdf',
			isSingleChunk: true
		});

		expect(result.bucket).toBe('secrets');
		expect(result.files).toHaveLength(1);
		expect(result.files[0]).toMatchObject({
			id: 'c1',
			name: 'report.pdf',
			size: 100,
			mimeType: 'application/pdf',
			isSingleChunk: true,
			chunks: legacy.chunks
		});
	});

	it('derives missing legacy meta from the chunk list', () => {
		const legacy: FileReference = {
			bucket: 'secrets',
			chunks: [chunk('c1', 64), chunk('c2', 36)]
		};

		const [file] = normalizeFileEnvelope(legacy).files;

		expect(file.name).toBe('secret-file.bin');
		expect(file.mimeType).toBe('application/octet-stream');
		expect(file.size).toBe(100);
		expect(file.isSingleChunk).toBe(false);
	});

	it('survives a legacy envelope with no chunks', () => {
		// Degenerate data (zero-byte uploads are rejected), but it must not throw.
		const [file] = normalizeFileEnvelope({ bucket: 'secrets', chunks: [] }).files;

		expect(file.id).toBe('legacy-file');
		expect(file.size).toBe(0);
	});
});

describe('totalChunkSize', () => {
	it('sums chunk sizes and returns 0 for an empty list', () => {
		expect(totalChunkSize([chunk('a', 3), chunk('b', 4)])).toBe(7);
		expect(totalChunkSize([])).toBe(0);
	});
});

describe('fileDownloadKey', () => {
	it('scopes a file id to its secret', () => {
		expect(fileDownloadKey('secret-hash', 'file-1')).toBe('secret-hash:file-1');
	});
});

describe('createUploadSemaphore', () => {
	it('never runs more tasks concurrently than the limit', async () => {
		const semaphore = createUploadSemaphore(2);
		let active = 0;
		let peak = 0;

		await Promise.all(
			[...new Array(10).keys()].map(async () => {
				const release = await semaphore.acquire();
				active++;
				peak = Math.max(peak, active);
				await new Promise((resolve) => setTimeout(resolve, 5));
				active--;
				release();
			})
		);

		expect(peak).toBe(2);
		expect(active).toBe(0);
	});

	it('hands the slot to the next waiter when a task throws', async () => {
		const semaphore = createUploadSemaphore(1);
		const order: string[] = [];

		const failing = (async () => {
			const release = await semaphore.acquire();
			try {
				order.push('first');
				throw new Error('boom');
			} finally {
				release();
			}
		})();

		const following = (async () => {
			const release = await semaphore.acquire();
			order.push('second');
			release();
		})();

		await expect(failing).rejects.toThrow('boom');
		await following;

		expect(order).toEqual(['first', 'second']);
	});
});
