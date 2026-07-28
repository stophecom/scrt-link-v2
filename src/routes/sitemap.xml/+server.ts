import { getBaseUrl } from '$lib/constants';
import { getComparisons } from '$lib/data/comparisons';
import { baseLocale, locales, localizeHref } from '$lib/paraglide/runtime';
import { getBlogPosts } from '$lib/server/blog';

import type { RequestHandler } from './$types';

// Public, crawlable marketing and info pages. Excludes auth flows,
// account pages, secret retrieval links (/s, /r, /l), the API, and
// white-label routes (those live on their own custom domains).
//
// `localized: false` mirrors `markNotTranslated` on the page itself. Those pages
// emit an English-only canonical and no hreflang, so advertising alternates here
// would contradict the markup and leave the locale variants without a canonical
// Google accepts. Keep the two in sync when a page gains or loses translations.
const STATIC_PATHS: { path: string; localized?: boolean }[] = [
	{ path: '/' },
	{ path: '/about' },
	{ path: '/pricing' },
	{ path: '/business' },
	{ path: '/faq' },
	{ path: '/contact' },
	{ path: '/security' },
	{ path: '/privacy' },
	{ path: '/farewell' },
	{ path: '/imprint' },
	{ path: '/use-cases/customer-support' },
	{ path: '/use-cases/it-security' },
	{ path: '/use-cases/journalists' },
	{ path: '/use-cases/legal-compliance' },
	{ path: '/api-documentation', localized: false },
	{ path: '/cli', localized: false },
	{ path: '/blog', localized: false },
	{ path: '/alternatives', localized: false },
	{ path: '/acceptable-use-policy', localized: false },
	{ path: '/cookie-policy', localized: false },
	{ path: '/dpa', localized: false },
	{ path: '/gdpr', localized: false },
	{ path: '/privacy-policy', localized: false },
	{ path: '/sla', localized: false },
	{ path: '/terms-of-service', localized: false }
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
		...STATIC_PATHS.map(({ path, localized }) => buildUrlEntry(baseUrl, path, { localized })),
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
