import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { saveUser } from '$lib/server/form/actions';
import { userFormValidator } from '$lib/server/form/validators';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	return {
		user,
		userForm: await userFormValidator(user),
		pageTitle: m.super_flaky_wallaby_pick()
	};
};

export const actions: Actions = {
	saveUser: saveUser
};
