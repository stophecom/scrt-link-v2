import { redirectLocalized } from '$lib/i18n';
import { logout } from '$lib/server/form/actions';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	return redirectLocalized(302, 'account/secrets');
};

export const actions: Actions = {
	logout
};
