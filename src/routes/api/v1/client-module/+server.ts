// src/routes/api/proxy-client-module/+server.ts
import { error } from '@sveltejs/kit';

export async function GET({ fetch }) {
	// Proxying the pre-built client module
	const res = await fetch('/client-module.js');
	if (!res.ok) {
		throw error(404, 'Script not found');
	}

	const script = await res.text();

	return new Response(script, {
		headers: {
			'Content-Type': 'application/javascript',
			'Access-Control-Allow-Origin': '*', // Or a specific origin
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
}
