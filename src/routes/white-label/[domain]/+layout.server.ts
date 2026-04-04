import { error, redirect } from '@sveltejs/kit';

import { PUBLIC_IMGIX_CDN_URL } from '$env/static/public';
import { isOriginalHostname } from '$lib/app-routing';
import { getWhiteLabelSiteByHost, getWhiteLabelSiteOwnerTier } from '$lib/server/whiteLabelSite';
import type { Theme } from '$lib/types';

import type { LayoutServerLoad } from './$types';

// Routes excluded from the mandatory encryption guard
const ENCRYPTION_GUARD_EXCLUDED = [
	'/encryption',
	'/set-password',
	'/recover-encryption',
	'/login',
	'/login/password',
	'/signup',
	'/verify-email'
];

export const load: LayoutServerLoad = async ({ locals, url, params }) => {
	// const hostNameFromUrl = new URL(url).hostname || '';
	// const hostNameFromUrl = params.domain;
	const hostNameFromUrl = params.domain || new URL(url).hostname;

	const whiteLabel = await getWhiteLabelSiteByHost(hostNameFromUrl);

	// If site is not published
	if (!isOriginalHostname(url.hostname) && !whiteLabel.published) {
		throw error(403, `Page is not published.`);
	}

	const { name, logo, logoDarkMode, appIcon, ogImage, theme } = whiteLabel;
	const ownerTier = await getWhiteLabelSiteOwnerTier(whiteLabel.userId);

	// Enforce mandatory encryption setup for authenticated white-label users
	const user = locals.user;
	if (user && !user.encryptionEnabled) {
		// Strip the /white-label/domain prefix and any locale prefix (e.g. /en, /de)
		const prefix = `/white-label/${hostNameFromUrl}`;
		let relativePath = url.pathname.replace(prefix, '');
		// Remove locale prefix if present (2-letter or 5-letter like zh-CN)
		relativePath = relativePath.replace(/^\/[a-z]{2}(-[A-Z]{2})?(?=\/|$)/, '');
		const isExcluded = ENCRYPTION_GUARD_EXCLUDED.some(
			(excluded) => relativePath === excluded || relativePath.startsWith(excluded + '/')
		);

		if (!isExcluded) {
			console.error('is excluded');
			if (!user.hasPassword) {
				redirect(302, '/set-password');
			} else {
				redirect(302, '/encryption');
			}
		}
	}

	const getImageUrl = (src: string | null) =>
		src ? `https://${PUBLIC_IMGIX_CDN_URL}/${src}` : undefined;

	const getLogo = (fileName: string | undefined | null) =>
		fileName ? `https://${PUBLIC_IMGIX_CDN_URL}/${fileName}?auto=compress&w=300` : undefined;

	return {
		user: locals.user,
		ownerTier,
		domain: params.domain,
		name,
		appIcon: getImageUrl(appIcon),
		ogImage: getImageUrl(ogImage),
		logo: getLogo(logo),
		logoDarkMode: getLogo(logoDarkMode),
		theme: theme as Theme
	};
};
