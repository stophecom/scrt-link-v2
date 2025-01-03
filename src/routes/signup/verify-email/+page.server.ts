import { error, redirect } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { hashPassword, verifyPassword } from '$lib/crypo';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { emailVerificationRequest, user } from '$lib/server/db/schema';
import { createEmailVerificationRequest } from '$lib/server/email-verification';
import { checkIfUserExists } from '$lib/server/helpers';
// import { ExpiringTokenBucket } from '$lib/server/rate-limit';
import { codeFormSchema } from '$lib/validators/formSchemas';

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
		form: await superValidate(defaultValues, zod(codeFormSchema), {
			errors: false
		})
	};
}

// const bucket = new ExpiringTokenBucket<number>(5, 60 * 30);

export const actions: Actions = {
	verifyCode: verifyCode,
	resend: resendEmail
};

async function verifyCode(event: RequestEvent) {
	const form = await superValidate(event.request, zod(codeFormSchema));
	const { code, email } = form.data;

	try {
		const [result] = await db
			.select()
			.from(emailVerificationRequest)
			.where(and(eq(emailVerificationRequest.email, email)))
			.orderBy(desc(emailVerificationRequest.expiresAt));

		console.log(result);
		console.log('code', code.toString());

		console.log('hashed code', await hashPassword(code));

		if (!(await verifyPassword(code, result.codeHash))) {
			return message(form, 'Invalid Token');
		}

		if (result.expiresAt < new Date()) {
			return message(form, 'Token expired');
		}

		// Check existing email
		if (await checkIfUserExists(email)) {
			// Technically we can use "return setError". For some reason this doesn't work with "use:enhance" enabled.
			return message(form, 'E-mail already exists. Sign in instead.');
		}

		const [userResult] = await db.insert(user).values({ email, emailVerified: true }).returning();

		// Save

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userResult.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return message(form, 'Works');
	} catch (e) {
		console.error(e);
		error(500, 'Failed to register');
	}

	// if (!bucket.check(event.locals.user.id, 1)) {
	// 	return fail(429, {
	// 		verify: {
	// 			message: 'Too many requests'
	// 		}
	// 	});
	// }

	// if (Date.now() >= verificationRequest.expiresAt.getTime()) {
	// 	verificationRequest = createEmailVerificationRequest(
	// 		verificationRequest.userId,
	// 		verificationRequest.email
	// 	);
	// 	sendVerificationEmail(verificationRequest.email, verificationRequest.code);
	// 	return {
	// 		verify: {
	// 			message: 'The verification code was expired. We sent another code to your inbox.'
	// 		}
	// 	};
	// }

	// deleteUserEmailVerificationRequest(event.locals.user.id);
	// invalidateUserPasswordResetSessions(event.locals.user.id);
	// updateUserEmailAndSetEmailAsVerified(event.locals.user.id);
	// deleteEmailVerificationRequestCookie(event);

	return redirect(302, '/signup/set-password');
}

async function resendEmail(event: RequestEvent) {
	const form = await superValidate(event.request, zod(codeFormSchema));
	const { email } = form.data;
	console.log('foobar');
	return message(form, 'Works');

	// const email = event.cookies.get('email_verification');
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

	// Throttling
	// Cleanup?

	// if (!sendVerificationEmailBucket.consume(event.locals.user.id, 1)) {
	// 	return fail(429, {
	// 		resend: {
	// 			message: 'Too many requests'
	// 		}
	// 	});
	// }
}
