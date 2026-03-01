import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages';
import { postSecret } from '$lib/server/form/actions';
import { secretFormValidator } from '$lib/server/form/validators';
import { fetchSecrets } from '$lib/server/secrets';

import { actions as secretActions } from '../../+page.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const secrets = await fetchSecrets({ userId: user.id, host: url.host });
	const secretForm = await secretFormValidator();

	return {
		user,
		secrets,
		secretForm,
		pageTitle: m.free_nimble_whale_fry()
	};
};

export const actions: Actions = {
	...secretActions,
	postSecret: postSecret
};
