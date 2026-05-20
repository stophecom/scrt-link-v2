import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createGuardHook } from 'svelte-guard';

import { isOriginalHostname } from '$lib/app-routing';
import { ThemeOptions, TierOptions } from '$lib/data/enums';
import { paraglideMiddleware } from '$lib/paraglide/server';
import * as auth from '$lib/server/auth.js';
import { getEffectiveTierForUser } from '$lib/server/organization';
import { getWhiteLabelSiteByHost } from '$lib/server/whiteLabelSite';

const guards = import.meta.glob('./routes/**/-guard.*');
export const handleGuards = createGuardHook(guards);

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		event.locals.effectiveTier = TierOptions.CONFIDENTIAL;
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
	event.locals.effectiveTier = user
		? await getEffectiveTierForUser(user.id, user.subscriptionTier ?? TierOptions.CONFIDENTIAL)
		: TierOptions.CONFIDENTIAL;

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

const handleWhiteLabelSite: Handle = async ({ event, resolve }) => {
	const hostname = event.url.hostname;

	// Determine the domain to look up:
	// - Custom domain request: use the hostname itself
	// - Preview route (/white-label/[domain]/...): use the route param
	// - All other app routes (e.g. /account/white-label/edit/[domain]): don't set whiteLabelSite
	let domain: string | null = null;
	if (!isOriginalHostname(hostname)) {
		domain = hostname;
	} else if (event.route.id?.startsWith('/white-label/[domain]')) {
		domain = event.params.domain ?? null;
	}

	event.locals.whiteLabelSite = domain ? ((await getWhiteLabelSiteByHost(domain)) ?? null) : null;
	return resolve(event);
};

type ThemeVars = { primary: string; primaryFg: string; accent: string };
type Theme = { light: ThemeVars; dark: ThemeVars };

const THEME_MAP: Record<ThemeOptions, Theme> = {
	[ThemeOptions.NAVY]: {
		light: { primary: '#1a2942', primaryFg: '#ffffff', accent: '#d92f2f' },
		dark: { primary: '#3a5a92', primaryFg: '#ffffff', accent: '#e85555' }
	},
	[ThemeOptions.PINK]: {
		light: { primary: '#e60077', primaryFg: '#ffffff', accent: '#2c1b55' },
		dark: { primary: '#ff3d96', primaryFg: '#ffffff', accent: '#f0e1ff' }
	},
	[ThemeOptions.PURPLE]: {
		light: { primary: '#70379d', primaryFg: '#ffffff', accent: '#f59e0b' },
		dark: { primary: '#a04be2', primaryFg: '#ffffff', accent: '#fbbf24' }
	},
	[ThemeOptions.BLUE]: {
		light: { primary: '#2071c9', primaryFg: '#ffffff', accent: '#f97316' },
		dark: { primary: '#60a5fa', primaryFg: '#000000', accent: '#fb923c' }
	},
	[ThemeOptions.TEAL]: {
		light: { primary: '#076969', primaryFg: '#ffffff', accent: '#f97316' },
		dark: { primary: '#2dd4bf', primaryFg: '#003838', accent: '#fb923c' }
	}
};

function buildThemeStyle(theme: Theme): string {
	const l = theme.light;
	const d = theme.dark;
	return `<style>
		:root {
			--color-primary: ${l.primary};
			--color-primary-foreground: ${l.primaryFg};
			--color-accent: ${l.accent};
		}
		.dark {
			--color-primary: ${d.primary};
			--color-primary-foreground: ${d.primaryFg};
			--color-accent: ${d.accent};
		}
	</style>`;
}

const handleTheme: Handle = async ({ event, resolve }) => {
	// White-label sites inject their own theme via white-label/[domain]/+layout.svelte
	if (event.locals.whiteLabelSite) {
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%THEME_CSS%', '')
		});
	}

	const themeOption =
		(event.locals.user?.preferences?.themeColor as ThemeOptions) ?? ThemeOptions.NAVY;
	const theme = THEME_MAP[themeOption] ?? THEME_MAP[ThemeOptions.NAVY];

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%THEME_CSS%', buildThemeStyle(theme))
	});
};

const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	return response;
};

export const handle: Handle = sequence(
	handleSecurityHeaders,
	handleAuth,
	handleWhiteLabelSite,
	handleGuards,
	paraglideHandle,
	handleTheme
);
