import { type Action, error, fail } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import type { PostgresError } from 'postgres';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { isOriginalHost } from '$lib/app-routing';
import { MAX_API_KEYS_PER_USER, MAX_ORGANIZATIONS_PER_USER } from '$lib/constants';
import { generateBase64Token, scryptHash, verifyPassword } from '$lib/crypto';
import { MembershipRole } from '$lib/data/enums';
import { getUserPlanLimits } from '$lib/data/plans';
import { getExpiresInOptions } from '$lib/data/secretSettings';
import { addDomainToVercel, removeDomainFromVercelProject, validDomainRegex } from '$lib/domains';
import { formatDateTime, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { getLocale, locales } from '$lib/paraglide/runtime';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import {
	apiKey,
	emailVerificationRequest,
	membership,
	organization,
	user as userSchema,
	userSettings,
	whiteLabelSite
} from '$lib/server/db/schema';
import type { LocalizedWhiteLabelMessage, Theme } from '$lib/types';
import { dropUndefinedValuesFromObject } from '$lib/utlis';
import {
	apiKeyFormSchema,
	emailFormSchema,
	emailVerificationCodeFormSchema,
	organizationFormSchema,
	passwordFormSchema,
	secretFormSchema,
	settingsFormSchema,
	signInFormSchema,
	themeFormSchema,
	userFormSchema,
	whiteLabelMetaSchema,
	whiteLabelSiteSchema
} from '$lib/validators/formSchemas';

import {
	createEmailVerificationRequest,
	createEmailVerificationRequestAndRedirect,
	deleteEmailVerificationRequests
} from '../email-verification';
import { ALLOWED_REQUESTS_PER_MINUTE, limiter } from '../rate-limit';
import { saveSecret } from '../secrets';
import {
	checkIfUserExists,
	checkIsEmailVerified,
	createOrUpdateUser,
	getActiveApiKeys,
	getMembersByOrganization,
	getOrganizationsByUser
} from '../user';
import { getWhiteLabelSiteByHost, getWhiteLabelSiteByUserId } from '../whiteLabelSite';

export const postSecret: Action = async (event) => {
	const form = await superValidate(event.request, zod(secretFormSchema()));

	const host = event.url.host;

	if (!form.valid) {
		return fail(400, { form });
	}

	const user = event.locals.user;

	try {
		const { receiptId, expiresIn, expiresAt } = await saveSecret({
			userId: user?.id,
			secretRequest: form.data,
			host
		});

		const expirationPeriod =
			getExpiresInOptions().find((item) => item.value === expiresIn)?.label || '';
		const expirationDate = formatDateTime(new Date(expiresAt));

		const expirationMessage = m.real_actual_cockroach_type({
			time: `${expirationPeriod}: ${expirationDate}`
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
		.insert(userSettings)
		.values({
			userId: user.id,
			email,
			ntfyEndpoint,
			readReceipt: readReceiptOption
		})
		.onConflictDoUpdate({
			target: userSettings.userId,
			set: { email, ntfyEndpoint, readReceipt: readReceiptOption }
		});

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
		title: m.brief_wide_macaw_learn()
	});
};

export const createOrganization: Action = async (event) => {
	const form = await superValidate(event.request, zod(organizationFormSchema()));

	const { name } = form.data;

	const user = event.locals.user;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirectLocalized(307, '/signup');
	}
	const userOrganizations = await getOrganizationsByUser(user.id);

	// Too many organizations
	if (userOrganizations.length >= MAX_ORGANIZATIONS_PER_USER) {
		return message(
			form,
			{
				status: 'error',
				title: m.plane_solid_shrike_coax(),
				description: m.merry_suave_bullock_race({ amount: MAX_ORGANIZATIONS_PER_USER })
			},
			{
				status: 401
			}
		);
	}

	const [organizationResult] = await db
		.insert(organization)
		.values({
			createdBy: user.id,
			name
		})
		.returning();

	// Add creator as owner
	await db.insert(membership).values({
		userId: user.id,
		organizationId: organizationResult.id,
		role: MembershipRole.OWNER
	});

	return message(form, {
		status: 'success',
		title: 'Organization created'
	});
};

export const editOrganization: Action = async (event) => {
	const form = await superValidate(event.request, zod(organizationFormSchema()));

	const { name, id } = form.data;

	const user = event.locals.user;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirectLocalized(307, '/signup');
	}
	const userOrganizations = await getOrganizationsByUser(user.id);

	if (!id || !userOrganizations.length || !userOrganizations.some((item) => item.id === id)) {
		return message(
			form,
			{
				status: 'error',
				title: 'Not allowed'
			},
			{
				status: 401
			}
		);
	}

	await db
		.update(organization)
		.set({
			name
		})
		.where(eq(organization.id, id));

	return message(form, {
		status: 'success',
		title: m.this_good_parakeet_grasp()
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

	// If user doesn't have a password (e.g. from old version of scrt.link) or email is not verified.
	if (!result.passwordHash || !result.emailVerified) {
		// User needs to verify his/her email
		await createEmailVerificationRequestAndRedirect(event, email);
	}

	event.cookies.set('email_verification', email, {
		path: '/'
	});

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

		// Restrict login to white-label
		const host = event.url.host;
		if (host && !isOriginalHost(host)) {
			const whiteLabelSiteResult = await getWhiteLabelSiteByHost(host);

			// Site is restricted to either user (owner) or members of the assigned organization
			const isOwner = result.id === whiteLabelSiteResult.userId;
			const orgId = whiteLabelSiteResult.organizationId;

			if (!isOwner) {
				if (!orgId) {
					throw Error(`Access is restricted. No organization assigned to this site.`);
				}
				if (whiteLabelSiteResult.organizationId) {
					const members = await getMembersByOrganization(whiteLabelSiteResult.organizationId);
					const isMember = members.some((item) => item.email === email);

					if (!isMember) {
						throw Error(
							`Access is restricted. Only owners or assigned organization members are allowed to login to ${host}`
						);
					}
				}
			}
		}

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
		await auth.createSession(event, result.id);

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

	// User needs to verify his/her email
	await createEmailVerificationRequestAndRedirect(event, email);
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

		// Create or update user
		const { userId } = await createOrUpdateUser({
			email: email,
			emailVerified: true
		});

		// Create session
		await auth.createSession(event, userId);

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
	await createEmailVerificationRequestAndRedirect(event, email);
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

export const createAPIToken: Action = async (event) => {
	const form = await superValidate(event.request, zod(apiKeyFormSchema()));

	const user = event.locals.user;

	const { description } = form.data;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const activeApiKeys = await getActiveApiKeys(user.id);

	// Too many API keys
	if (activeApiKeys.length >= MAX_API_KEYS_PER_USER) {
		return message(
			form,
			{
				status: 'error',
				title: m.neat_less_jurgen_trip(),
				description: m.such_safe_leopard_lend({ amount: MAX_API_KEYS_PER_USER })
			},
			{
				status: 401
			}
		);
	}

	await db.insert(apiKey).values({
		userId: user.id,
		description: description || m.real_fluffy_clownfish_fetch(),
		key: `ak_${generateBase64Token()}`
	});

	return message(form, {
		status: 'success',
		title: m.sleek_heavy_shad_exhale()
	});
};

export const revokeAPIToken: Action = async (event) => {
	const apiKeyForm = await superValidate(event.request, zod(apiKeyFormSchema()), {
		id: 'api-token-form'
	});
	const { keyId } = apiKeyForm.data;
	const user = event.locals.user;

	if (!user || !keyId) {
		return fail(401);
	}

	await db
		.update(apiKey)
		.set({ revoked: true })
		.where(and(eq(apiKey.id, keyId), eq(apiKey.userId, user.id)));

	return message(apiKeyForm, {
		status: 'success',
		title: m.cool_white_frog_scold()
	});
};

export const saveWhiteLabelMeta: Action = async (event) => {
	const form = await superValidate(event.request, zod(whiteLabelMetaSchema()));

	if (!form.valid) {
		return fail(400, { form });
	}

	const user = event.locals.user;

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const planLimits = getUserPlanLimits(user?.subscriptionTier);

	if (!planLimits.whiteLabel) {
		return message(
			form,
			{
				status: 'error',
				title: m.busy_even_hawk_inspire()
			},
			{ status: 405 }
		);
	}

	const { locale, customDomain, isPrivate, name, enabledSecretTypes, organizationId } = form.data;

	if (!validDomainRegex.test(customDomain)) {
		return message(
			form,
			{
				status: 'error',
				title: m.less_dirty_jurgen_kick(),
				description: m.zippy_ornate_pelican_greet()
			},
			{ status: 405 }
		);
	}

	try {
		const existing = await getWhiteLabelSiteByUserId(user.id);

		// If the domain changed, we remove the existing one from vercel
		if (existing.customDomain && existing.customDomain !== customDomain) {
			await removeDomainFromVercelProject(existing.customDomain);
		}

		// Adding domain to vercel
		const response = await addDomainToVercel(customDomain);
		if (response?.error) {
			// The error code  "domain_already_in_use" is expected, We therefore exclude it from handling.
			if (response.error?.code !== 'domain_already_in_use') {
				return message(
					form,
					{
						status: 'error',
						title: m.dizzy_sour_liger_treasure()
					},
					{ status: 404 }
				);
			}

			throw Error(JSON.stringify(response));
		}
	} catch (e) {
		console.error(e);
	}

	try {
		await db
			.insert(whiteLabelSite)
			.values({
				locale: locale,
				customDomain,
				name,
				private: isPrivate,
				organizationId: organizationId,
				enabledSecretTypes,
				userId: user.id
			})
			.onConflictDoUpdate({
				target: whiteLabelSite.userId,
				set: {
					locale,
					customDomain,
					name,
					private: isPrivate,
					organizationId: organizationId,
					enabledSecretTypes
				}
			});
	} catch (error) {
		console.error(error);

		if ((error as PostgresError)?.code === '23505') {
			setError(form, 'customDomain', m.dark_each_pug_value({ customDomain: customDomain }));
			return message(
				form,
				{
					status: 'error',
					title: m.dizzy_sour_liger_treasure(),
					description: m.dark_each_pug_value({ customDomain: customDomain })
				},
				{ status: 404 }
			);
		}

		return message(
			form,
			{
				status: 'error',
				title: m.dizzy_sour_liger_treasure(),
				description: 'DB error'
			},
			{ status: 404 }
		);
	}

	return message(form, {
		status: 'success',
		title: m.lime_curly_capybara_bend()
	});
};

export const saveWhiteLabelSite: Action = async (event) => {
	const form = await superValidate(event.request, zod(whiteLabelSiteSchema()), {
		strict: true // Prevent null coercion - used for logo/appIcon/ogImage
	});

	if (!form.valid) {
		return fail(400, { form });
	}

	const user = event.locals.user;
	const locale = getLocale();

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const planLimits = getUserPlanLimits(user?.subscriptionTier);

	if (!planLimits.whiteLabel) {
		return message(
			form,
			{
				status: 'error',
				title: m.busy_even_hawk_inspire(),
				description: `Please upgrade to perform this action.`
			},
			{ status: 405 }
		);
	}

	// Reminder: All form data is optional
	const {
		title,
		lead,
		description,
		imprint,
		primaryColor,
		logo,
		logoDarkMode,
		appIcon,
		ogImage,
		published
	} = form.data;

	const existingWhiteLabelSite = await getWhiteLabelSiteByUserId(user.id);

	// @todo Delete logo/app icon on S3

	// We store page content, such as title, lead, description as JSON.
	// We therefor allow translating user content.
	const messagesJson =
		(existingWhiteLabelSite.messages as LocalizedWhiteLabelMessage) ||
		locales.reduce((acc, locale) => {
			acc[locale] = {};
			return acc;
		}, {} as LocalizedWhiteLabelMessage);

	// Prepare theme
	const themeJson = (existingWhiteLabelSite.theme as Theme) || {};
	Object.assign(themeJson, dropUndefinedValuesFromObject({ primaryColor }));

	// If non existent, create new entry
	if (!existingWhiteLabelSite) {
		messagesJson[locale] = { title, lead, description, imprint };

		await db.insert(whiteLabelSite).values({
			...dropUndefinedValuesFromObject({ logo, logoDarkMode, appIcon, ogImage }),
			published: published,
			userId: user.id,
			theme: themeJson,
			messages: messagesJson
		});
	} else {
		Object.assign(
			messagesJson[locale],
			dropUndefinedValuesFromObject({ title, lead, description, imprint })
		);

		await db
			.update(whiteLabelSite)
			.set({
				...dropUndefinedValuesFromObject({ logo, logoDarkMode, appIcon, ogImage }),
				published: published,
				userId: user.id,
				theme: themeJson,
				messages: messagesJson
			})
			.where(eq(whiteLabelSite.userId, user.id));
	}

	return message(form, {
		status: 'success',
		title: 'Success'
	});
};
