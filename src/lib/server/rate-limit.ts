import type { RequestEvent } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

import { dev } from '$app/environment';
import { RATE_LIMIT_COOKIE_SECRET } from '$env/static/private';
import { m } from '$lib/paraglide/messages.js';

import { PostgresRateLimiterStore } from './rate-limit-store';

export const limiter = new RateLimiter({
	// Shared store across all serverless instances. The default in-memory store
	// is per-lambda, so requests can bypass limits by hitting different instances.
	store: new PostgresRateLimiterStore(),
	IP: [500, 'h'], // IP address limiter (relaxed for shared IPs — CGNAT/corporate NATs can host 50+ users)
	IPUA: [15, 'm'], // IP + User Agent limiter
	cookie: {
		// Cookie limiter
		name: 'limiterid', // Unique cookie name for this limiter
		secret: RATE_LIMIT_COOKIE_SECRET, // Use $env/static/private
		rate: [15, 'm'],
		// preflight: true causes the library to return hash() = false (not null) when the
		// cookie is missing, which triggers an IMMEDIATE block regardless of IP/IPUA counts.
		// A user with no cookie gets a 429 on their very first request. On Vercel serverless
		// this fires constantly: cold-start lambdas, edge-cached pages, and cookie-blocking
		// browsers all arrive without the cookie. With preflight: false the library sets the
		// cookie on the first action call itself (graceful fallback) and counts normally.
		preflight: false
	},
	onLimited: async (_event, reason) => {
		console.warn(`[rate-limit] blocked: reason=${reason}`);
	}
});

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
