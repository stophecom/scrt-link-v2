import { redirectLocalized } from '$lib/i18n';
import {
	createAPIToken,
	logout,
	revokeAPIToken,
	saveSettings,
	saveTheme,
	saveUser
} from '$lib/server/form/actions';
import {
	apiKeyFormValidator,
	settingsFormValidator,
	themeFormValidator,
	userFormValidator
} from '$lib/server/form/validators';
import { getActiveApiKeys } from '$lib/server/user';

import { actions as secretActions } from '../+page.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/signup');
	}
	const user = event.locals.user;

	const apiKeys = await getActiveApiKeys(user.id);

	return {
		user: user,
		themeForm: await themeFormValidator(user),
		settingsForm: await settingsFormValidator(user),
		userForm: await userFormValidator(user),
		apiKeys: apiKeys,
		apiKeyForm: await apiKeyFormValidator()
	};
};

export const actions: Actions = {
	...secretActions,
	saveTheme: saveTheme,
	saveSettings: saveSettings,
	saveUser: saveUser,
	createAPIToken: createAPIToken,
	revokeAPIToken: revokeAPIToken,
	logout: logout
};
