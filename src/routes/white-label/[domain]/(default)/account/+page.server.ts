import { redirectLocalized } from '$lib/i18n';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	return redirectLocalized(302, 'account/secrets');
};
