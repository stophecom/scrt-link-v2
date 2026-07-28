/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import type { SecretFile } from './lib/file-transfer';
import { fileDownloadKey, handleFileChunksDownload } from './lib/file-transfer';

// Request URL we intercept to initiate stream
const DOWNLOAD_URL = /service-worker-file-download/;
// Keyed per file (`${secretIdHash}:${fileId}`), since one response streams one file
// and a secret may hold several.
const map = new Map<string, SecretFile>();

sw.addEventListener('install', (event) => {
	event.waitUntil(sw.skipWaiting());
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(sw.clients.claim()); // Become available to all pages
});

async function decryptStream(downloadKey: string) {
	const file = map.get(downloadKey);

	if (!file) {
		return new Response(null, { status: 400 });
	}

	try {
		const responseHeaders = {
			'Content-Disposition': `attachment; filename="${
				encodeURIComponent(file.name) ?? 'secret-file.bin'
			}"`,
			'Content-Type': file.mimeType ?? 'application/octet-stream'
		};

		const responseStream = handleFileChunksDownload(file);

		return new Response(responseStream, { headers: responseHeaders });
	} catch (e) {
		console.error(e);
		return new Response(
			`
			<!DOCTYPE html>
			<html>
			<head><title>Error</title></head>
			<body><h1>Something went wrong.</h1></body>
			</html>
			`,
			{
				headers: { 'Content-Type': 'text/html' }
			}
		);
	}
}

sw.onfetch = (event: FetchEvent) => {
	const req = event.request;

	if (req.method !== 'GET') {
		return;
	}

	const url = new URL(req.url);
	const fileNameMatch = DOWNLOAD_URL.exec(url.pathname);
	const downloadKey = decodeURIComponent(url.hash.substring(1));

	if (fileNameMatch && downloadKey) {
		event.respondWith(decryptStream(downloadKey));
	}
	return;
};

type FileHandle = Pick<SecretFile, 'secretIdHash' | 'id'>;

sw.onmessage = async (event: ExtendableMessageEvent) => {
	const request = event.data.request;

	switch (request) {
		case 'file_info': {
			const data = event.data.data as SecretFile;
			map.set(fileDownloadKey(data.secretIdHash, data.id), data);
			event.ports[0].postMessage('File info received.');
			break;
		}
		case 'progress': {
			const data = event.data.data as FileHandle;
			const file = data && map.get(fileDownloadKey(data.secretIdHash, data.id));

			if (!file?.progress) {
				event.ports[0].postMessage(0);
				return;
			}

			event.ports[0].postMessage(file.progress);
			break;
		}

		default:
			break;
	}
};
