import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createGuardHook } from 'svelte-guard';

import { paraglideMiddleware } from '$lib/paraglide/server';
import * as auth from '$lib/server/auth.js';

const guards = import.meta.glob('./routes/**/-guard.*');
export const handleGuards = createGuardHook(guards);

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

const handleTheme: Handle = async ({ event, resolve }) => {
	const user = event.locals.user;

	const themeColor = user?.preferences?.themeColor
		? `var(--theme-color-${user?.preferences.themeColor})`
		: `var(--theme-color-pink)`;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%THEME_COLOR%', themeColor)
	});
};

export const handle: Handle = sequence(handleAuth, handleGuards, paraglideHandle, handleTheme);
