import { redirectLocalized } from '$lib/i18n';
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
		apiKeyForm: await apiKeyFormValidator()
	};
};

export const actions: Actions = {
	createAPIToken: createAPIToken,
	revokeAPIToken: revokeAPIToken
};
