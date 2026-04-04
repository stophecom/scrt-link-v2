import { redirect } from '@sveltejs/kit';

import { getBaseUrl } from '$lib/constants';

import type { LayoutServerLoad } from './$types';

// Routes excluded from the mandatory encryption guard
const ENCRYPTION_GUARD_EXCLUDED = [
	'/encryption',
	'/set-password',
	'/recover-encryption',
	'/logout',
	'/delete-account',
	'/login',
	'/signup',
	'/verify-email',
	'/reset-password',
	'/invite'
];

export const load: LayoutServerLoad = async (event) => {
	const user = event.locals.user;

	// Enforce mandatory encryption setup for authenticated users
	if (user && !user.encryptionEnabled) {
		// Strip locale prefix if present (e.g. /en, /de, /zh-CN)
		const path = event.url.pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?(?=\/|$)/, '');
		const isExcluded = ENCRYPTION_GUARD_EXCLUDED.some(
			(excluded) => path === excluded || path.startsWith(excluded + '/')
		);

		if (!isExcluded && !path.startsWith('/api/')) {
			if (!user.hasPassword) {
				// OAuth user without password — set password first
				redirect(302, '/set-password');
			} else {
				// Has password but no encryption — go to encryption setup
				redirect(302, '/encryption');
			}
		}
	}

	return {
		user,
		baseUrl: getBaseUrl()
	};
};
