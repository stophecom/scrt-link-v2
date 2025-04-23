// src/routes/api/proxy-client-module/+server.ts
import { error } from '@sveltejs/kit';

import { PUBLIC_PRODUCTION_URL } from '$env/static/public';
import { isOriginalHost } from '$lib/app-routing.js';

export async function GET({ fetch, url }) {
	const originalUrl = url;
	const host = originalUrl.host;

	if (!host) {
		throw error(404, 'Host not found.');
	}

	if (!isOriginalHost(host)) {
		throw error(
			405,
			`Not allowed. Only requests to original host (${PUBLIC_PRODUCTION_URL}) are allowed.`
		);
	}

	// Proxying the pre-built client module
	const res = await fetch('/client-module.js');
	if (!res.ok) {
		throw error(404, 'Script not found.');
	}

	const script = await res.text();

	return new Response(script, {
		headers: {
			'Content-Type': 'application/javascript',
			'Access-Control-Allow-Origin': '*', // Or a specific origin
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
}
