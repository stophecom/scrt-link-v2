import type { Reroute } from '@sveltejs/kit';

import { PUBLIC_PRODUCTION_URL } from '$env/static/public';
import { deLocalizeUrl } from '$lib/paraglide/runtime';

// We use reroute (rewrite) for
// 1. Localization: A request to '/de/foo' will use route '/foo'
// 2. For handling custom-domain, which we use for white-label sites.
// E.g. If a domain br3f.com is registered with the vercel project, we use route '/white-label/br3f.com'
export const reroute: Reroute = (request) => {
	const { url } = request;

	const originalUrl = url;
	const host = originalUrl.host;

	if (!host) {
		return deLocalizeUrl(request.url).pathname;
	}

	// Handle all possible production domains.
	// Preview domain regex (e.g. scrt-link-v2-caqr8zo1g-stophe.vercel.app)
	const regex = /^[a-zA-Z0-9-]+-stophe\.vercel\.app$/;

	// We need to exclude requests to api routes
	const regexApiRoute = /^\/api.*$/;

	if (
		host === 'localhost:5173' ||
		host === PUBLIC_PRODUCTION_URL ||
		host === `www.${PUBLIC_PRODUCTION_URL}` ||
		host === `dev.${PUBLIC_PRODUCTION_URL}` ||
		host === `scrt-link-v2.vercel.app` ||
		regex.test(host) ||
		regexApiRoute.test(originalUrl.pathname)
	) {
		return deLocalizeUrl(request.url).pathname;
	}

	// For custom domains (white label case), we reroute to /white-label/[domain]
	// Note that we have to deLocalize the original path
	originalUrl.pathname = `/white-label/${host}${deLocalizeUrl(originalUrl).pathname}`;

	return originalUrl.pathname;
};
