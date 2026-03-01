import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages';
import { createAPIToken, revokeAPIToken } from '$lib/server/form/actions';
import { apiKeyFormValidator } from '$lib/server/form/validators';
import { getActiveApiKeys } from '$lib/server/user';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const apiKeys = await getActiveApiKeys(user.id);

	return {
		user,
		apiKeys,
		apiKeyForm: await apiKeyFormValidator(),
		pageTitle: m.super_funny_jackal_pause()
	};
};

export const actions: Actions = {
	createAPIToken: createAPIToken,
	revokeAPIToken: revokeAPIToken
};
