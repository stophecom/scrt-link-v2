import type { RequestEvent } from '@sveltejs/kit';
import { Google } from 'arctic';
import { eq } from 'drizzle-orm';

import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	VERCEL_ENV,
	VERCEL_PROJECT_PRODUCTION_URL
} from '$env/static/private';
import { generateBase64Token } from '$lib/crypo';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { createHash } from '$lib/web-crypto';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const scheme = VERCEL_ENV === 'development' ? 'http' : 'https';
export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	return generateBase64Token();
}

export async function createSession(token: string, userId: string) {
	const hash = await createHash(token);
	const sessionId = hash;
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = await createHash(token);
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: {
				id: table.user.id,
				name: table.user.name,
				email: table.user.email,
				googleId: table.user.googleId,
				picture: table.user.picture
			},
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

// OAuth Provider
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	`${scheme}://${VERCEL_PROJECT_PRODUCTION_URL}/login/google/callback`
);
