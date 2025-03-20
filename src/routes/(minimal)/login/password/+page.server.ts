import { redirectLocalized } from '$lib/i18n';
import { loginWithPassword } from '$lib/server/form/actions';
import { loginPasswordFormValidator } from '$lib/server/form/validators';
import { limiter } from '$lib/server/rate-limit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const email = event.cookies.get('email_verification');
	await limiter.cookieLimiter?.preflight(event);

	if (event.locals.user) {
		return redirectLocalized(307, '/account');
	}

	// No email from cookie
	if (!email) {
		return redirectLocalized(307, '/signup');
	}

	const defaultValues = {
		email
	};

	return {
		passwordForm: await loginPasswordFormValidator(defaultValues)
	};
};

export const actions: Actions = {
	loginWithPassword: loginWithPassword
};
