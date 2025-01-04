import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

import { google } from '$lib/server/auth';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const scopes = ['openid', 'profile', 'email'];
	const url = google.createAuthorizationURL(state, codeVerifier, scopes);

	event.cookies.set('google_oauth_state', state, {
		path: '/',
		maxAge: 60 * 10
	});

	event.cookies.set('google_code_verifier', codeVerifier, {
		path: '/',
		maxAge: 60 * 10 // 10 min
	});

	redirect(302, url.toString());
}
