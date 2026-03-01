import { sha256Hash } from '@scrt-link/core';
import type { RequestEvent } from '@sveltejs/kit';
import { Google } from 'arctic';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { getBaseUrl } from '$lib/constants';
import { generateBase64Token } from '$lib/crypto';
import { ThemeOptions } from '$lib/data/enums';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const preferencesSchema = z
	.object({
		themeColor: z.nativeEnum(ThemeOptions).default(ThemeOptions.PINK)
	})
	.default({ themeColor: ThemeOptions.PINK });

export const sessionCookieName = 'auth-session';

export async function createSession(event: RequestEvent, userId: string) {
	const sessionToken = generateBase64Token();
	const hash = await sha256Hash(sessionToken);
	const sessionId = hash;
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.session).values(session);

	setSessionTokenCookie(event, sessionToken, session.expiresAt);
}

export async function validateSessionToken(token: string) {
	const sessionId = await sha256Hash(token);
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: {
				id: table.user.id,
				name: table.user.name,
				email: table.user.email,
				googleId: table.user.googleId,
				stripeCustomerId: table.user.stripeCustomerId,
				role: table.user.role,
				subscriptionTier: table.user.subscriptionTier,
				picture: table.user.picture,
				preferences: table.user.preferences
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

	return {
		session,
		user: {
			...user,
			preferences: preferencesSchema.parse(user.preferences || undefined)
		}
	};
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
	`${getBaseUrl()}/login/google/callback`
);
