import { redirectLocalized } from '$lib/i18n';
import { logout, saveSettings, saveTheme, saveUser } from '$lib/server/form/actions';
import {
	settingsFormValidator,
	themeFormValidator,
	userFormValidator
} from '$lib/server/form/validators';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	return {
		user,
		themeForm: await themeFormValidator(user),
		settingsForm: await settingsFormValidator(user),
		userForm: await userFormValidator(user)
	};
};

export const actions: Actions = {
	saveTheme: saveTheme,
	saveSettings: saveSettings,
	saveUser: saveUser,
	logout: logout
};
