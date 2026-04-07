import { redirectLocalized } from '$lib/i18n';
import { resetPassword } from '$lib/server/form/actions';
import { emailFormValidator } from '$lib/server/form/validators';
import { rateLimiterPreflight } from '$lib/server/rate-limit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await rateLimiterPreflight(event);

	if (event.locals.user) {
		return redirectLocalized(307, '/');
	}
	return {
		resetPasswordForm: await emailFormValidator()
	};
};

export const actions: Actions = {
	resetPassword: resetPassword
};
