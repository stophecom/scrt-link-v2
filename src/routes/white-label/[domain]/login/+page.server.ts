import { redirectLocalized } from '$lib/i18n';
import { loginWithEmail } from '$lib/server/form/actions';
import { emailFormValidator } from '$lib/server/form/validators';
import { limiter } from '$lib/server/rate-limit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await limiter.cookieLimiter?.preflight(event);

	if (event.locals.user) {
		return redirectLocalized(307, '/');
	}

	return {
		emailForm: await emailFormValidator()
	};
};

export const actions: Actions = {
	loginWithEmail: loginWithEmail
};
