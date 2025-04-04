import type { RequestEvent } from '@sveltejs/kit';
import { ArcticFetchError, OAuth2RequestError, type OAuth2Tokens } from 'arctic';
import { eq } from 'drizzle-orm';

import * as auth from '$lib/server/auth';
import { google } from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import stripeInstance from '$lib/server/stripe';

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
		const [user] = await db
			.insert(table.user)
			.values({
				googleId: googleUser.sub,
				emailVerified: googleUser.email_verified,
				picture: googleUser.picture,
				name: googleUser.name,
				email: googleUser.email
			})
			.onConflictDoUpdate({
				target: table.user.email,
				set: {
					googleId: googleUser.sub,
					emailVerified: googleUser.email_verified,
					picture: googleUser.picture,
					name: googleUser.name,
					email: googleUser.email
				}
			})
			.returning();

		// Conditionally add user settings
		await db
			.insert(table.userSettings)
			.values({
				userId: user.id,
				email: user.email
			})
			.onConflictDoNothing({
				target: table.userSettings.userId
			});

		// In case a user doesn't have a stripe account, we create one
		if (!user.stripeCustomerId) {
			const stripeCustomer = await stripeInstance.customers.create({
				email: user.email
			});

			await db
				.update(table.user)
				.set({ stripeCustomerId: stripeCustomer.id })
				.where(eq(table.user.id, user.id));
		}

		// Create session
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

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
