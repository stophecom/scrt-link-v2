import { RateLimiter } from 'sveltekit-rate-limiter/server';

import { RATE_LIMIT_COOKIE_SECRET } from '$env/static/private';

export const ALLOWED_REQUESTS_PER_MINUTE = 3;

export const limiter = new RateLimiter({
	IP: [10, 'h'], // IP address limiter
	IPUA: [5, 'm'], // IP + User Agent limiter
	cookie: {
		// Cookie limiter
		name: 'limiterid', // Unique cookie name for this limiter
		secret: RATE_LIMIT_COOKIE_SECRET, // Use $env/static/private
		rate: [ALLOWED_REQUESTS_PER_MINUTE, 'm'],
		preflight: true // Require preflight call (see load function)
	}
});
