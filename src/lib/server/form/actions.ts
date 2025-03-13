import { type Action, error, fail } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { generateRandomUrlSafeString, scryptHash, verifyPassword } from '$lib/crypto';
import { getExpiresInOptions } from '$lib/data/secretSettings';
import { redirectLocalized } from '$lib/i18n';
import * as m from '$lib/paraglide/messages.js';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import {
	emailVerificationRequest,
	secret,
	stats,
	user as userSchema,
	userSettings
} from '$lib/server/db/schema';
import {
	emailFormSchema,
	emailVerificationCodeFormSchema,
	passwordFormSchema,
	secretFormSchema,
	settingsFormSchema,
	signInFormSchema,
	themeFormSchema,
	userFormSchema
} from '$lib/validators/formSchemas';

import {
	createEmailVerificationRequest,
	deleteEmailVerificationRequests
} from '../email-verification';
import { checkIfUserExists, checkIsEmailVerified } from '../helpers';
import { ALLOWED_REQUESTS_PER_MINUTE, limiter } from '../rate-limit';
import stripeInstance from '../stripe';

export const postSecret: Action = async (event) => {
	const form = await superValidate(event.request, zod(secretFormSchema()));

	const { content, password, secretIdHash, meta, expiresIn, publicKey } = form.data;

	if (!form.valid) {
		return fail(400, { form });
	}

	let passwordHash;

	try {
		if (password) {
			passwordHash = await scryptHash(password);
		}

		// Attach user to secret, if exists
		const user = event.locals.user;
		const receiptId = generateRandomUrlSafeString(8);

		await db.insert(secret).values({
			secretIdHash,
			meta,
			content,
			passwordHash,
			expiresAt: new Date(Date.now() + expiresIn),
			publicKey,
			receiptId,
			userId: user?.id
		});

		// Global stats
		await db
			.insert(stats)
			.values({ id: 1, scope: 'global' })
			.onConflictDoUpdate({
				target: stats.id,
				set: { totalSecrets: sql`${stats.totalSecrets} + 1` }
			});

		// Individual user stats
		if (user) {
			await db
				.insert(stats)
				.values({
					userId: user.id,
					scope: 'user'
				})
				.onConflictDoUpdate({
					target: stats.userId,
					set: { totalSecrets: sql`${stats.totalSecrets} + 1` }
				});
		}
		const expirationMessage = m.real_actual_cockroach_type({
			time: getExpiresInOptions().find((item) => item.value === expiresIn)?.label || ''
		});

		const readReceiptMessage = m.deft_lucky_quail_pause({ receiptId });

		return message(form, {
			status: 'success',
			description: [expirationMessage, ...(user ? [readReceiptMessage] : [])].join('\n\n')
		});
	} catch (e) {
		console.error(e);
		error(500, `Couldn't save secret.`);
	}
};

export const saveTheme: Action = async (event) => {
	const form = await superValidate(event.request, zod(themeFormSchema()));
	if (!form.valid) {
		return fail(400, { form });
	}

	const user = event.locals.user;

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const { themeOption } = form.data;

	await db
		.update(userSchema)
		.set({
			preferences: { themeColor: themeOption }
		})

		.where(eq(userSchema.id, user.id));

	return { form };
};

export const saveSettings: Action = async (event) => {
	const form = await superValidate(event.request, zod(settingsFormSchema()));

	const user = event.locals.user;

	const { email, ntfyEndpoint, readReceiptOption } = form.data;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	await db
		.update(userSettings)
		.set({
			email,
			ntfyEndpoint,
			readReceipt: readReceiptOption
		})
		.where(eq(userSettings.userId, user.id));

	return message(form, {
		status: 'success',
		title: m.many_seemly_gorilla_jolt()
	});
};

export const saveUser: Action = async (event) => {
	const form = await superValidate(event.request, zod(userFormSchema()));

	const { name } = form.data;

	const user = event.locals.user;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	await db
		.update(userSchema)
		.set({
			name
		})
		.where(eq(userSchema.id, user.id));

	return message(form, {
		status: 'success',
		title: 'Saved'
	});
};

export const loginWithEmail: Action = async (event) => {
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

	const [result] = await db.select().from(userSchema).where(eq(userSchema.email, email)).limit(1);
	if (!result) {
		setError(form, 'email', m.funny_mushy_coyote_inspire());
		return { form };
	}

	event.cookies.set('email_verification', email, {
		path: '/'
	});

	// If user doesn't have a password (e.g. from old version of scrt.link) or email is not verified.
	if (!result.passwordHash || !result.emailVerified) {
		return redirectLocalized(303, '/verify-email');
	}

	return redirectLocalized(303, '/login/password');
};

export const loginWithPassword: Action = async (event) => {
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
		const [result] = await db.select().from(userSchema).where(eq(userSchema.email, email)).limit(1);

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

	return redirectLocalized(303, '/account');
};

export const signupWithEmail: Action = async (event) => {
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

	return redirectLocalized(303, '/verify-email');
};

export const verifyEmailVerificationCode: Action = async (event) => {
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
			.insert(userSchema)
			.values({ email, emailVerified: true })
			.onConflictDoUpdate({
				target: userSchema.email,
				set: { emailVerified: true }
			})
			.returning();

		// In case a user doesn't have a stripe account, we create one
		if (!userResult.stripeCustomerId) {
			const stripeCustomer = await stripeInstance.customers.create({
				email: userResult.email
			});

			await db
				.update(userSchema)
				.set({ stripeCustomerId: stripeCustomer.id })
				.where(eq(userSchema.id, userResult.id));
		}

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

	return redirectLocalized(303, '/set-password');
};

export const resendEmailVerificationCode: Action = async (event) => {
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
		return redirectLocalized(307, '/signup');
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
};

export const resetPassword: Action = async (event) => {
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

	return redirectLocalized(303, '/verify-email');
};

export const setPassword: Action = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/login');
	}

	const passwordForm = await superValidate(event.request, zod(passwordFormSchema()));

	if (!passwordForm.valid) {
		return fail(400, { form: passwordForm });
	}

	const { password } = passwordForm.data;

	try {
		// Update user
		const hashedPassword = await scryptHash(password);

		await db
			.update(userSchema)
			.set({ passwordHash: hashedPassword })
			.where(eq(userSchema.id, event.locals.user.id));
	} catch (e) {
		console.error(e);
		error(500, 'Failed to set password.');
	}

	return redirectLocalized(303, '/account');
};

export const logout: Action = async (event) => {
	if (!event.locals.session) {
		return fail(401);
	}
	await auth.invalidateSession(event.locals.session.id);
	auth.deleteSessionTokenCookie(event);

	return redirectLocalized(303, '/');
};
