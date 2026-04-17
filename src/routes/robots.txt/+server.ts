import { getBaseUrl } from '$lib/constants';

import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const baseUrl = getBaseUrl();
	const body = `User-agent: *
Allow: /
Disallow: /s/
Disallow: /r/
Disallow: /account/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
