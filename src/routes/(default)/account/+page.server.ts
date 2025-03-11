import { redirect } from '@sveltejs/kit';

import { logout, saveSettings, saveTheme } from '$lib/server/form/actions';
import { settingsFormValidator, themeFormValidator } from '$lib/server/form/validators';

import { actions as secretActions } from '../+page.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(307, '/signup');
	}
	const user = event.locals.user;

	return {
		user: user,
		themeForm: await themeFormValidator(user),
		settingsForm: await settingsFormValidator(user)
	};
};

export const actions: Actions = {
	...secretActions,
	saveTheme: saveTheme,
	saveSettings: saveSettings,
	logout: logout
};
