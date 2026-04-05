import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

import { google } from '$lib/server/auth';
import { setGoogleOAuthCookies } from '$lib/server/cookies';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const scopes = ['openid', 'profile', 'email'];
	const url = google.createAuthorizationURL(state, codeVerifier, scopes);

	setGoogleOAuthCookies(event, state, codeVerifier);

	redirect(307, url.toString());
}
