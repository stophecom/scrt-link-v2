import { redirectLocalized } from '$lib/i18n';
import { createEmailVerificationRequest } from '$lib/server/email-verification';
import { resendEmailVerificationCode, verifyEmailVerificationCode } from '$lib/server/form/actions';
import {
	emailVerificationFormValidator,
	resendEmailVerificationFormValidator
} from '$lib/server/form/validators';
import { limiter } from '$lib/server/rate-limit';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
	await limiter.cookieLimiter?.preflight(event);
	const email = event.cookies.get('email_verification');

	// Already logged in
	if (event.locals.user) {
		return redirectLocalized(307, '/account');
	}

	// No email from cookie
	if (!email) {
		return redirectLocalized(307, '/signup');
	}

	// User needs to verify his/her email
	await createEmailVerificationRequest(email);

	const defaultValues = {
		email
	};

	return {
		verificationForm: await emailVerificationFormValidator(defaultValues),
		resendForm: await resendEmailVerificationFormValidator(defaultValues)
	};
}

export const actions: Actions = {
	verifyEmailVerificationCode: verifyEmailVerificationCode,
	resend: resendEmailVerificationCode
};
