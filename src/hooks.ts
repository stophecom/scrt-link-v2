import type { Reroute } from '@sveltejs/kit';

import { isOriginalHost } from '$lib/app-routing';
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

	// We need to exclude requests to api routes
	const regexApiRoute = /^\/api.*$/;

	if (isOriginalHost(host) || regexApiRoute.test(originalUrl.pathname)) {
		return deLocalizeUrl(request.url).pathname;
	}

	// For custom domains (white label case), we reroute to /white-label/[domain]
	// Note that we have to deLocalize the original path
	originalUrl.pathname = `/white-label/${host}${deLocalizeUrl(originalUrl).pathname}`;

	return originalUrl.pathname;
};
