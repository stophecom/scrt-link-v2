import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import * as m from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
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
			return message(
				form,
				{
					status: 'error',
					title: m.nimble_fancy_pony_amuse(),
					description: m.that_dark_cockroach_hint({ amountOfMinutes: ALLOWED_REQUESTS_PER_MINUTE })
				},
				{ status: 429 }
			);
		}

		const { email } = form.data;

		if (!form.valid) {
			return fail(400, { form });
		}

		const [result] = await db.select().from(user).where(eq(user.email, email)).limit(1);
		if (!result) {
			setError(form, 'email', m.funny_mushy_coyote_inspire());
			return { form };
		}

		event.cookies.set('email_verification', email, {
			path: '/'
		});

		// If user doesn't have a password (e.g. from old version of scrt.link) or email is not verified.
		if (!result.passwordHash || !result.emailVerified) {
			return redirect(303, '/verify-email');
		}

		return redirect(303, '/login/password');
	}
};
