import { redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import * as m from '$lib/paraglide/messages.js';
import { checkIfUserExists, checkIsEmailVerified } from '$lib/server/helpers';
import { emailFormSchema } from '$lib/validators/formSchemas';

// import { userInsertSchema } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
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

		const { email } = form.data;

		if (!form.valid) {
			return fail(400, { form });
		}

		// Check existing email
		if ((await checkIfUserExists(email)) && (await checkIsEmailVerified(email))) {
			// Technically we can use "return setError". For some reason this doesn't work with "use:enhance" enabled.
			setError(form, 'email', m.agent_same_puma_achieve());
			return { form };
		}

		event.cookies.set('email_verification', email, {
			path: '/'
		});

		return redirect(303, '/verify-email');
	}
};
