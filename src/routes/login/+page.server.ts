import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { RATE_LIMIT_COOKIE_SECRET } from '$env/static/private';
import { verifyPassword } from '$lib/crypo';
import * as m from '$lib/paraglide/messages.js';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { signInFormSchema } from '$lib/validators/formSchemas';

// import { userInsertSchema } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

const ALLOWED_REQUESTS_PER_MINUTE = 3;

const limiter = new RateLimiter({
	IP: [10, 'h'], // IP address limiter
	IPUA: [5, 'm'], // IP + User Agent limiter
	cookie: {
		// Cookie limiter
		name: 'limiterid', // Unique cookie name for this limiter
		secret: RATE_LIMIT_COOKIE_SECRET, // Use $env/static/private
		rate: [ALLOWED_REQUESTS_PER_MINUTE, 'm'],
		preflight: true // Require preflight call (see load function)
	}
});

export const load: PageServerLoad = async (event) => {
	await limiter.cookieLimiter?.preflight(event);
	if (event.locals.user) {
		return redirect(307, '/account');
	}
	return {
		form: await superValidate(zod(signInFormSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(signInFormSchema));

		if (await limiter.isLimited(event)) {
			return message(form, {
				type: 'error',
				title: m.nimble_fancy_pony_amuse(),
				description: m.that_dark_cockroach_hint({ amountOfMinutes: ALLOWED_REQUESTS_PER_MINUTE })
			});
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
		} catch (e) {
			console.log(e);

			return message(form, {
				type: 'error',
				title: 'Login failed',
				description: 'Incorrect login credentials. Please try again.'
			});
		}

		return redirect(303, '/account');
	}
};
