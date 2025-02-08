import { error, redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { verifyPassword } from '$lib/crypto';
import * as m from '$lib/paraglide/messages.js';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { emailVerificationRequest, user, userSettings } from '$lib/server/db/schema';
import {
	createEmailVerificationRequest,
	deleteEmailVerificationRequests
} from '$lib/server/email-verification';
import { ALLOWED_REQUESTS_PER_MINUTE, limiter } from '$lib/server/rate-limit';
import { emailFormSchema, emailVerificationCodeFormSchema } from '$lib/validators/formSchemas';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
	await limiter.cookieLimiter?.preflight(event);
	const email = event.cookies.get('email_verification');

	// Already logged in
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
		verificationForm: await superValidate(defaultValues, zod(emailVerificationCodeFormSchema()), {
			errors: false
		}),
		resendForm: await superValidate(defaultValues, zod(emailFormSchema()), {
			errors: false,
			id: 'resend-form'
		})
	};
}

export const actions: Actions = {
	verifyCode: verifyCode,
	resend: resendCode
};

async function verifyCode(event: RequestEvent) {
	const verificationForm = await superValidate(
		event.request,
		zod(emailVerificationCodeFormSchema())
	);

	if (await limiter.isLimited(event)) {
		return message(
			verificationForm,
			{
				status: 'error',
				title: m.nimble_fancy_pony_amuse(),
				description: m.that_dark_cockroach_hint({ amountOfMinutes: ALLOWED_REQUESTS_PER_MINUTE })
			},
			{ status: 429 }
		);
	}

	const { code, email } = verificationForm.data;

	try {
		const [result] = await db
			.select()
			.from(emailVerificationRequest)
			.where(eq(emailVerificationRequest.email, email))
			.orderBy(desc(emailVerificationRequest.expiresAt));

		if (!result) {
			return message(
				verificationForm,
				{
					status: 'error',
					title: m.caring_royal_panther_race(),
					description: m.honest_level_donkey_ask()
				},
				{
					status: 401
				}
			);
		}

		if (!(await verifyPassword(code, result.codeHash))) {
			return message(
				verificationForm,
				{
					status: 'error',
					title: m.every_tired_canary_express(),
					description: m.stout_front_pug_pout()
				},
				{
					status: 401
				}
			);
		}

		if (result.expiresAt < new Date()) {
			return message(
				verificationForm,
				{
					status: 'error',
					title: m.upper_simple_sheep_grip(),
					description: m.flat_plane_frog_tap()
				},
				{
					status: 401
				}
			);
		}

		// All check passed. We create or update user and session.
		const [userResult] = await db
			.insert(user)
			.values({ email, emailVerified: true })
			.onConflictDoUpdate({
				target: user.email,
				set: { emailVerified: true }
			})
			.returning();

		await db.insert(userSettings).values({
			userId: userResult.id,
			email: userResult.email
		});

		// Create session
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userResult.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		// Cleanup DB and Cookies
		await deleteEmailVerificationRequests(email);
		event.cookies.delete('email_verification', { path: '/' });
	} catch (e) {
		console.error(e);
		error(500, 'Failed to register');
	}

	return redirect(303, '/set-password');
}

async function resendCode(event: RequestEvent) {
	const resendForm = await superValidate(event.request, zod(emailFormSchema()), {
		id: 'resend-form'
	});

	if (await limiter.isLimited(event)) {
		return message(
			resendForm,
			{
				status: 'error',
				title: m.nimble_fancy_pony_amuse(),
				description: m.that_dark_cockroach_hint({ amountOfMinutes: ALLOWED_REQUESTS_PER_MINUTE })
			},
			{ status: 429 }
		);
	}

	const { email } = resendForm.data;

	// No email from cookie
	if (!email) {
		return redirect(307, '/signup');
	}
	try {
		await createEmailVerificationRequest(email);
	} catch (e) {
		console.error(e);
		error(500, `Something went wrong. Couldn't send email verification code.`);
	}

	return message(resendForm, {
		status: 'success',
		title: m.warm_male_shark_fade(),
		description: m.mellow_wise_bobcat_hope()
	});
}
