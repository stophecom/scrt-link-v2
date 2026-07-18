import { getBaseUrl } from '$lib/constants';
import { getComparisons } from '$lib/data/comparisons';
import { baseLocale, locales, localizeHref } from '$lib/paraglide/runtime';
import { getBlogPosts } from '$lib/server/blog';

import type { RequestHandler } from './$types';

// Public, crawlable marketing and info pages. Excludes auth flows,
// account pages, secret retrieval links (/s, /r, /l), the API, and
// white-label routes (those live on their own custom domains).
const STATIC_PATHS = [
	'/',
	'/about',
	'/pricing',
	'/faq',
	'/contact',
	'/developers',
	'/api-documentation',
	'/security',
	'/privacy',
	'/farewell',
	'/blog',
	'/alternatives',
	'/acceptable-use-policy',
	'/cookie-policy',
	'/gdpr',
	'/imprint',
	'/privacy-policy',
	'/sla',
	'/terms-of-service'
];

const escapeXml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

// `localized: false` for English-only content (blog posts, comparisons). Those pages
// exist under every locale prefix but are never translated, so advertising hreflang
// alternates for them would be a false signal to search engines.
const buildUrlEntry = (
	baseUrl: string,
	path: string,
	{ lastmod, localized = true }: { lastmod?: string; localized?: boolean } = {}
) => {
	const canonical = `${baseUrl}${localizeHref(path, { locale: baseLocale })}`;
	const alternates = localized
		? [
				...locales.map(
					(locale) =>
						`    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(
							`${baseUrl}${localizeHref(path, { locale })}`
						)}"/>`
				),
				`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(canonical)}"/>`
			].join('\n')
		: '';

	return `  <url>
    <loc>${escapeXml(canonical)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}${
			alternates ? `\n${alternates}` : ''
		}
  </url>`;
};

export const GET: RequestHandler = async () => {
	const baseUrl = getBaseUrl();
	const posts = await getBlogPosts();

	const entries = [
		...STATIC_PATHS.map((path) => buildUrlEntry(baseUrl, path)),
		...posts.map((post) =>
			buildUrlEntry(baseUrl, `/blog/${post.slug}`, {
				lastmod: new Date(post.date).toISOString(),
				localized: false
			})
		),
		...getComparisons().map((comparison) =>
			buildUrlEntry(baseUrl, `/alternatives/${comparison.slug}`, {
				lastmod: new Date(comparison.lastVerified).toISOString(),
				localized: false
			})
		)
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
