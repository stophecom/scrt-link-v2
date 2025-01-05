import { error, redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { RATE_LIMIT_COOKIE_SECRET } from '$env/static/private';
import { verifyPassword } from '$lib/crypo';
import * as m from '$lib/paraglide/messages.js';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { emailVerificationRequest, user } from '$lib/server/db/schema';
import {
	createEmailVerificationRequest,
	deleteEmailVerificationRequests
} from '$lib/server/email-verification';
import { checkIfUserExists } from '$lib/server/helpers';
import { emailFormSchema, emailVerificationCodeFormSchema } from '$lib/validators/formSchemas';

import type { Actions, RequestEvent } from './$types';

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
		return message(verificationForm, {
			type: 'error',
			title: m.nimble_fancy_pony_amuse(),
			description: m.that_dark_cockroach_hint({ amountOfMinutes: ALLOWED_REQUESTS_PER_MINUTE })
		});
	}

	const { code, email } = verificationForm.data;

	try {
		const [result] = await db
			.select()
			.from(emailVerificationRequest)
			.where(eq(emailVerificationRequest.email, email))
			.orderBy(desc(emailVerificationRequest.expiresAt));

		if (!result) {
			return message(verificationForm, {
				type: 'error',
				title: 'No token found',
				description:
					'Email validation request failed or token has expired. Please restart the verification process.'
			});
		}

		if (!(await verifyPassword(code, result.codeHash))) {
			return message(verificationForm, {
				type: 'error',
				title: 'Invalid token',
				description: 'Check your code or send a new code.'
			});
		}

		if (result.expiresAt < new Date()) {
			return message(verificationForm, {
				type: 'error',
				title: 'Token expired',
				description: 'Send a new code.'
			});
		}

		// Check existing email
		if (await checkIfUserExists(email)) {
			return message(verificationForm, {
				type: 'error',
				title: 'Email already exists',
				description:
					'There is a user account associated with the email: {emailAddress}. Try to sign in instead.'
			});
		}

		// All check passed. We create a user and session.
		const [userResult] = await db.insert(user).values({ email, emailVerified: true }).returning();

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

	return redirect(303, '/auth/set-password');
}

async function resendCode(event: RequestEvent) {
	console.log('Send code again');
	const resendForm = await superValidate(event.request, zod(emailFormSchema()), {
		id: 'resend-form'
	});

	if (await limiter.isLimited(event)) {
		return message(resendForm, {
			type: 'error',
			title: m.nimble_fancy_pony_amuse(),
			description: m.that_dark_cockroach_hint({ amountOfMinutes: ALLOWED_REQUESTS_PER_MINUTE })
		});
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
		type: 'success',
		title: 'Code sent',
		description: 'We sent you a new code. Please check your email.'
	});
}
