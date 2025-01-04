import { error, redirect } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { verifyPassword } from '$lib/crypo';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { emailVerificationRequest, user } from '$lib/server/db/schema';
import {
	createEmailVerificationRequest,
	deleteEmailVerificationRequests
} from '$lib/server/email-verification';
import { checkIfUserExists } from '$lib/server/helpers';
// import { ExpiringTokenBucket } from '$lib/server/rate-limit';
import { codeFormSchema, emailFormSchema } from '$lib/validators/formSchemas';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
	const email = event.cookies.get('email_verification');

	// Already logged in
	if (event.locals.user) {
		return redirect(302, '/account');
	}

	// No email from cookie
	if (!email) {
		return redirect(302, '/signup');
	}

	const defaultValues = {
		email
	};

	return {
		verificationForm: await superValidate(defaultValues, zod(codeFormSchema), {
			errors: false
		}),
		resendForm: await superValidate(defaultValues, zod(emailFormSchema), {
			errors: false,
			id: 'resend-form'
		})
	};
}

// const bucket = new ExpiringTokenBucket<number>(5, 60 * 30);

export const actions: Actions = {
	verifyCode: verifyCode,
	resend: resendEmail
};

async function verifyCode(event: RequestEvent) {
	const verificationForm = await superValidate(event.request, zod(codeFormSchema));
	const { code, email } = verificationForm.data;

	try {
		const [result] = await db
			.select()
			.from(emailVerificationRequest)
			.where(and(eq(emailVerificationRequest.email, email)))
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

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userResult.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} catch (e) {
		console.error(e);
		error(500, 'Failed to register');
	} finally {
		// Cleanup DB
		await deleteEmailVerificationRequests(email);
	}

	return redirect(302, '/signup/set-password');
}

async function resendEmail(event: RequestEvent) {
	console.log('Send code again');
	const resendForm = await superValidate(event.request, zod(emailFormSchema), {
		id: 'resend-form'
	});
	const { email } = resendForm.data;

	// No email from cookie
	if (!email) {
		return redirect(302, '/signup');
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
