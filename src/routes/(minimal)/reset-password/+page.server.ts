import { redirect } from '@sveltejs/kit';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import * as m from '$lib/paraglide/messages.js';
import { createEmailVerificationRequest } from '$lib/server/email-verification';
import { checkIfUserExists } from '$lib/server/helpers';
import { ALLOWED_REQUESTS_PER_MINUTE, limiter } from '$lib/server/rate-limit';
import { emailFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await limiter.cookieLimiter?.preflight(event);
	if (event.locals.user) {
		return redirect(307, '/account');
	}
	return {
		form: await superValidate(zod(emailFormSchema()))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(emailFormSchema()));

		if (await limiter.isLimited(event)) {
			return message(form, {
				type: 'error',
				title: m.nimble_fancy_pony_amuse(),
				description: m.that_dark_cockroach_hint({ amountOfMinutes: ALLOWED_REQUESTS_PER_MINUTE })
			});
		}

		const { email } = form.data;

		if (!form.valid) {
			return fail(400, { form });
		}

		// Check existing email
		if (!(await checkIfUserExists(email))) {
			// Technically we can use "return setError". For some reason this doesn't work with "use:enhance" enabled.
			setError(form, 'email', m.funny_mushy_coyote_inspire());
			return { form };
		}

		// User needs to verify his/her email
		await createEmailVerificationRequest(email);

		event.cookies.set('email_verification', email, {
			path: '/'
		});

		return redirect(303, '/verify-email');
	}
};
