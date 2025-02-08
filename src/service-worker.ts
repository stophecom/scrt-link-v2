/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import type { SecretFile } from './lib/file-transfer';
import { handleFileChunksDownload } from './lib/file-transfer';

// Request URL we intercept to initiate stream
const DOWNLOAD_URL = /service-worker-file-download/;
const map = new Map();

sw.addEventListener('install', (event) => {
	event.waitUntil(sw.skipWaiting());
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(sw.clients.claim()); // Become available to all pages
});

async function decryptStream(uuid: string) {
	const file: SecretFile = map.get(uuid);

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
	const fileUuid = url.hash.substring(1);

	if (fileNameMatch && fileUuid) {
		event.respondWith(decryptStream(fileUuid));
	}
	return;
};

type MessageData = SecretFile;

sw.onmessage = async (event: ExtendableMessageEvent) => {
	const request = event.data.request;
	const data = event.data.data as MessageData;

	switch (request) {
		case 'file_info': {
			map.set(data.secretIdHash, data);
			event.ports[0].postMessage('File info received.');
			break;
		}
		case 'progress': {
			const file = map.get(data?.secretIdHash);

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
