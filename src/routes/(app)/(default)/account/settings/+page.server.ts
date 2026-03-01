import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { logout, saveSettings, saveTheme } from '$lib/server/form/actions';
import { settingsFormValidator, themeFormValidator } from '$lib/server/form/validators';

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
		pageTitle: m.nimble_quick_bird_sew()
	};
};

export const actions: Actions = {
	saveTheme: saveTheme,
	saveSettings: saveSettings,
	logout: logout
};
