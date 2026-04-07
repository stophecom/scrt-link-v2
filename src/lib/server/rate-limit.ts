import type { RequestEvent } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

import { dev } from '$app/environment';
import { RATE_LIMIT_COOKIE_SECRET } from '$env/static/private';
import { m } from '$lib/paraglide/messages.js';

export const limiter = new RateLimiter({
	IP: [100, 'h'], // IP address limiter (relaxed for shared IPs)
	IPUA: [5, 'm'], // IP + User Agent limiter
	cookie: {
		// Cookie limiter
		name: 'limiterid', // Unique cookie name for this limiter
		secret: RATE_LIMIT_COOKIE_SECRET, // Use $env/static/private
		rate: [5, 'm'],
		preflight: true // Require preflight call (see load function)
	}
});

/** Set up rate limiter cookie. No-op in development. Call in load functions. */
export async function rateLimiterPreflight(event: RequestEvent): Promise<void> {
	if (dev) return;
	await limiter.cookieLimiter?.preflight(event);
}

/** Returns true when the request should be blocked. Always false in development. */
export async function isRateLimited(event: RequestEvent): Promise<boolean> {
	if (dev) return false;
	return limiter.isLimited(event);
}

/** Standardized 429 message payload — call at use-site so translations resolve correctly. */
export const rateLimitErrorMessage = (): App.Superforms.Message => ({
	status: 'error',
	title: m.nimble_fancy_pony_amuse(),
	description: m.blue_this_raven_seek()
});
