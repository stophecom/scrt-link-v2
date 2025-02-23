import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { verifyPassword } from '$lib/crypto';
import * as m from '$lib/paraglide/messages.js';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { ALLOWED_REQUESTS_PER_MINUTE, limiter } from '$lib/server/rate-limit';
import { signInFormSchema } from '$lib/validators/formSchemas';

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
		form: await superValidate(defaultValues, zod(signInFormSchema()), {
			errors: false
		})
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(signInFormSchema()));

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

		const { email, password } = form.data;

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const [result] = await db.select().from(user).where(eq(user.email, email)).limit(1);

			if (!result.passwordHash) {
				throw Error('No password hash in DB.');
			}

			if (!result.emailVerified) {
				throw Error('Email not verified.');
			}

			const isPasswordValid = await verifyPassword(password, result.passwordHash);
			if (!isPasswordValid) {
				throw Error(`Password doesn't match`);
			}

			// Create session
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, result.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
			event.cookies.delete('email_verification', { path: '/' });
		} catch (e) {
			console.error(e);

			return message(
				form,
				{
					status: 'error',
					title: m.livid_wild_crab_loop(),
					description: m.petty_flaky_lynx_boil()
				},
				{ status: 401 }
			);
		}

		return redirect(303, '/account');
	}
};
