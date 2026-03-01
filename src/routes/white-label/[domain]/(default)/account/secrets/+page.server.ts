import { redirectLocalized } from '$lib/i18n';
import { postSecret } from '$lib/server/form/actions';
import { secretFormValidator } from '$lib/server/form/validators';
import { fetchSecrets } from '$lib/server/secrets';

import { actions as secretActions } from '../../../../../(app)/(default)/account/secrets/+page.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const user = locals.user;

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const secrets = await fetchSecrets({ userId: user.id, host: url.host });

	return {
		user,
		secrets,
		secretForm: await secretFormValidator()
	};
};

export const actions: Actions = {
	...secretActions,
	postSecret
};
