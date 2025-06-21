import type { RequestEvent } from '@sveltejs/kit';
import { ArcticFetchError, OAuth2RequestError, type OAuth2Tokens } from 'arctic';

import * as auth from '$lib/server/auth';
import { google } from '$lib/server/auth';
import { createOrUpdateUser, welcomeNewUser } from '$lib/server/user';

export async function GET(event: RequestEvent): Promise<Response> {
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	let tokens: OAuth2Tokens;

	if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
		const accessToken = tokens.accessToken();

		const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		const googleUser: UserInfoResponse = await response.json();

		// Create or update user
		const { userId, name } = await createOrUpdateUser({
			email: googleUser.email,
			emailVerified: googleUser.email_verified || false,
			googleId: googleUser.sub,
			picture: googleUser.picture,
			name: googleUser.name
		});

		await welcomeNewUser({ email: googleUser.email, name });

		// Create session
		await auth.createSession(event, userId);

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/account'
			}
		});
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			// Invalid authorization code, credentials, or redirect URI
			const code = e.code;
			console.error(code);
		}
		if (e instanceof ArcticFetchError) {
			// Failed to call `fetch()`
			const cause = e.cause;
			console.error(cause);
		}
		console.error(e);
		return new Response(null, {
			status: 500
		});
	}
}

export interface UserInfoResponse {
	sub: string; // Unique identifier for the user (subject)
	name?: string; // Full name of the user
	given_name?: string; // First name of the user
	family_name?: string; // Last name of the user
	picture?: string; // URL to the user's profile picture
	email: string;
	email_verified?: boolean;
}
