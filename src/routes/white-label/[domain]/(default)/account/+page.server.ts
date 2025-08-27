import { redirectLocalized } from '$lib/i18n';
import { logout, saveUser } from '$lib/server/form/actions';
import { postSecret } from '$lib/server/form/actions';
import {
	secretFormValidator,
	settingsFormValidator,
	userFormValidator
} from '$lib/server/form/validators';
import { fetchSecrets } from '$lib/server/secrets';

import { actions as secretActions } from '../+page.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const user = locals.user;

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const secrets = await fetchSecrets({ userId: user.id, host: url.host });

	return {
		user: user,
		secrets: secrets,
		secretForm: await secretFormValidator(),
		settingsForm: await settingsFormValidator(user),
		userForm: await userFormValidator(user)
	};
};

export const actions: Actions = {
	...secretActions,
	saveUser: saveUser,
	postSecret: postSecret,
	logout: logout
};
