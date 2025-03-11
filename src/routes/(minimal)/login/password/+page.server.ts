import { redirect } from '@sveltejs/kit';

import { loginWithPassword } from '$lib/server/form/actions';
import { loginPasswordFormValidator } from '$lib/server/form/validators';
import { limiter } from '$lib/server/rate-limit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const email = event.cookies.get('email_verification');
	await limiter.cookieLimiter?.preflight(event);

	if (event.locals.user) {
		return redirect(307, '/account');
	}

	// No email from cookie
	if (!email) {
		return redirect(307, '/signup');
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
