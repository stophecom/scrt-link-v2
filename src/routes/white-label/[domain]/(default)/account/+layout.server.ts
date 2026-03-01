import { redirectLocalized } from '$lib/i18n';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	return {
		user
	};
};
