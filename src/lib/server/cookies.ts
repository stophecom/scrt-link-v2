import type { RequestEvent } from '@sveltejs/kit';

import { dev } from '$app/environment';

// --- Cookie names ---

export const EMAIL_VERIFICATION_COOKIE = 'email_verification';
export const PASSWORD_VERIFIED_COOKIE = 'password-verified';
export const RECOVERY_VERIFIED_COOKIE = 'recovery-verified';
const GOOGLE_OAUTH_STATE_COOKIE = 'google_oauth_state';
const GOOGLE_CODE_VERIFIER_COOKIE = 'google_code_verifier';

// --- Secure cookie defaults ---

const SECURE_COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	secure: !dev,
	sameSite: 'strict' as const,
	maxAge: 60 * 5 // 5 minutes
};

// --- Verification cookie helpers ---

/** Set a short-lived cookie proving a server-side check passed, bound to a user ID. */
export function setVerificationCookie(event: RequestEvent, name: string, userId: string) {
	event.cookies.set(name, userId, SECURE_COOKIE_OPTIONS);
}

/**
 * Consume a verification cookie. Returns true if valid for the given user ID.
 * The cookie is deleted on success to prevent reuse.
 */
export function consumeVerificationCookie(
	event: RequestEvent,
	name: string,
	userId: string
): boolean {
	const value = event.cookies.get(name);
	if (!value || value !== userId) return false;
	event.cookies.delete(name, { path: '/' });
	return true;
}

// --- Email verification cookie ---

export function setEmailVerificationCookie(event: RequestEvent, email: string) {
	event.cookies.set(EMAIL_VERIFICATION_COOKIE, email, {
		path: '/',
		secure: !dev
	});
}

export function getEmailVerificationCookie(event: RequestEvent): string | undefined {
	return event.cookies.get(EMAIL_VERIFICATION_COOKIE);
}

export function deleteEmailVerificationCookie(event: RequestEvent) {
	event.cookies.delete(EMAIL_VERIFICATION_COOKIE, { path: '/' });
}

// --- Google OAuth cookies ---

export function setGoogleOAuthCookies(event: RequestEvent, state: string, codeVerifier: string) {
	const options = {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax' as const, // lax required for OAuth redirect flow
		maxAge: 60 * 10 // 10 minutes
	};
	event.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, options);
	event.cookies.set(GOOGLE_CODE_VERIFIER_COOKIE, codeVerifier, options);
}

export function getGoogleOAuthCookies(event: RequestEvent) {
	return {
		state: event.cookies.get(GOOGLE_OAUTH_STATE_COOKIE) ?? null,
		codeVerifier: event.cookies.get(GOOGLE_CODE_VERIFIER_COOKIE) ?? null
	};
}
