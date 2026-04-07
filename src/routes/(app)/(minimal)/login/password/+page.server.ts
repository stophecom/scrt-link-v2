import { redirectLocalized } from '$lib/i18n';
import { getEmailVerificationCookie } from '$lib/server/cookies';
import { loginWithPassword } from '$lib/server/form/actions';
import { loginPasswordFormValidator } from '$lib/server/form/validators';
import { rateLimiterPreflight } from '$lib/server/rate-limit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const email = getEmailVerificationCookie(event) || '';

	await rateLimiterPreflight(event);

	if (event.locals.user) {
		return redirectLocalized(307, '/account');
	}

	// No email from cookie
	if (!email) {
		return redirectLocalized(307, '/signup');
	}

	return {
		passwordForm: await loginPasswordFormValidator({ email })
	};
};

export const actions: Actions = {
	loginWithPassword: loginWithPassword
};
