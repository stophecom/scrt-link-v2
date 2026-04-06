import { getBaseUrl } from '$lib/constants';
import { redirectLocalized } from '$lib/i18n';
import { hasNeedsRecoveryCookie } from '$lib/server/cookies';

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

// Routes allowed during the recovery flow
const RECOVERY_GUARD_ALLOWED = [
	'/recover-encryption',
	'/set-password',
	'/logout',
	'/delete-account'
];

export const load: LayoutServerLoad = async (event) => {
	const user = event.locals.user;

	if (!user) {
		return { user, baseUrl: getBaseUrl() };
	}

	// Strip locale prefix if present (e.g. /en, /de, /zh-CN)
	const path = event.url.pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?(?=\/|$)/, '');

	// Enforce recovery flow completion — user must set a new password
	if (hasNeedsRecoveryCookie(event, user.id)) {
		const isAllowed = RECOVERY_GUARD_ALLOWED.some(
			(allowed) => path === allowed || path.startsWith(allowed + '/')
		);
		if (!isAllowed && !path.startsWith('/api/')) {
			return redirectLocalized(302, '/recover-encryption');
		}
	}

	// Enforce mandatory encryption setup for authenticated users
	if (!user.encryptionEnabled) {
		const isExcluded = ENCRYPTION_GUARD_EXCLUDED.some(
			(excluded) => path === excluded || path.startsWith(excluded + '/')
		);

		if (!isExcluded && !path.startsWith('/api/')) {
			if (!user.hasPassword) {
				return redirectLocalized(302, '/set-password');
			} else {
				return redirectLocalized(302, '/encryption');
			}
		}
	}

	return {
		user,
		baseUrl: getBaseUrl()
	};
};
