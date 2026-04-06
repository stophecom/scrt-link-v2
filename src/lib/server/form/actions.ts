import { type Action, error, fail, isRedirect } from '@sveltejs/kit';
import { timingSafeEqual } from 'crypto';
import { and, desc, eq } from 'drizzle-orm';
import type { PostgresError } from 'postgres';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { isOriginalHostname } from '$lib/app-routing';
import {
	MAX_API_KEYS_PER_USER,
	MAX_ORGANIZATION_TEAM_SIZE,
	MAX_ORGANIZATIONS_PER_USER
} from '$lib/constants';
import { generateBase64Token, scryptHash, verifyPassword } from '$lib/crypto';
import { InviteStatus, MembershipRole } from '$lib/data/enums';
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
	invite,
	membership,
	organization,
	user as userSchema,
	userEncryptionKey,
	userSettings,
	whiteLabelSite
} from '$lib/server/db/schema';
import type { LocalizedWhiteLabelMessage, Theme } from '$lib/types';
import { dropUndefinedValuesFromObject } from '$lib/utils';
import {
	apiKeyFormSchema,
	emailFormSchema,
	emailVerificationCodeFormSchema,
	encryptionSetupFormSchema,
	inviteOrganizationMemberFormSchema,
	manageOrganizationMemberFormSchema,
	organizationFormSchema,
	passwordChangeWithEncryptionFormSchema,
	passwordFormSchema,
	recoverySetupFormSchema,
	recoveryVerifyFormSchema,
	secretFormSchema,
	settingsFormSchema,
	signInFormSchema,
	themeFormSchema,
	userFormSchema,
	whiteLabelMetaSchema,
	whiteLabelSiteSchema
} from '$lib/validators/formSchemas';

import {
	consumeVerificationCookie,
	deleteEmailVerificationCookie,
	PASSWORD_VERIFIED_COOKIE,
	RECOVERY_VERIFIED_COOKIE,
	setEmailVerificationCookie,
	setVerificationCookie
} from '../cookies';
import {
	createEmailVerificationRequest,
	createEmailVerificationRequestAndRedirect,
	deleteEmailVerificationRequests
} from '../email-verification';
import {
	getMembersAndInvitesByOrganization,
	getOrganizationsByUserId,
	inviteUserToOrganization
} from '../organization';
import { isRateLimited, rateLimitErrorMessage } from '../rate-limit';
import { saveSecret } from '../secrets';
import {
	checkIfUserExists,
	checkIsEmailVerified,
	createOrUpdateUser,
	getActiveApiKeys,
	getUserByEmail,
	getUserEncryptionKeyStore,
	verifyUserPassword,
	welcomeNewUser
} from '../user';
import {
	checkIsUserAllowedOnWhiteLabelSite,
	getWhiteLabelSiteByHost,
	getWhiteLabelSiteByUserId
} from '../whiteLabelSite';

export const postSecret: Action = async (event) => {
	const form = await superValidate(event.request, zod4(secretFormSchema()));
	const hostname = event.url.hostname;

	if (!form.valid) {
		return fail(400, { form });
	}

	const user = event.locals.user;

	let whiteLabelSiteId;
	if (hostname && !isOriginalHostname(hostname)) {
		const whiteLabelSiteResult = await getWhiteLabelSiteByHost(hostname);

		whiteLabelSiteId = whiteLabelSiteResult.id;
	}

	try {
		const { receiptId, expiresIn, expiresAt } = await saveSecret({
			userId: user?.id,
			secretRequest: form.data,
			whiteLabelSiteId
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
	const form = await superValidate(event.request, zod4(themeFormSchema()));
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
	const form = await superValidate(event.request, zod4(settingsFormSchema()));

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
	const form = await superValidate(event.request, zod4(userFormSchema()));

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
	const form = await superValidate(event.request, zod4(organizationFormSchema()));

	const { name } = form.data;

	const user = event.locals.user;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirectLocalized(307, '/signup');
	}
	const userOrganizations = await getOrganizationsByUserId(user.id);

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
		title: m.upper_wise_dove_propel()
	});
};

export const editOrganization: Action = async (event) => {
	const form = await superValidate(event.request, zod4(organizationFormSchema()));

	const { name, organizationId } = form.data;

	const user = event.locals.user;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirectLocalized(307, '/signup');
	}
	const userOrganizations = await getOrganizationsByUserId(user.id);

	const isOwner = userOrganizations.some(
		(item) => item.id === organizationId && item.role === MembershipRole.OWNER
	);

	if (!organizationId || !isOwner) {
		return message(
			form,
			{
				status: 'error',
				title: m.east_ago_hedgehog_pause()
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
		.where(eq(organization.id, organizationId));

	return message(form, {
		status: 'success',
		title: m.wild_born_blackbird_peel()
	});
};

export const addMemberToOrganization: Action = async (event) => {
	const form = await superValidate(event.request, zod4(inviteOrganizationMemberFormSchema()));

	const { email, organizationId, role, name } = form.data;

	const user = event.locals.user;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	// Make sure user is owner of the organization
	const userOrganizations = await getOrganizationsByUserId(user.id);
	const userOrganization = userOrganizations.find(
		(item) => item.id === organizationId && item.role === MembershipRole.OWNER
	);

	if (!organizationId || !userOrganization) {
		return message(
			form,
			{
				status: 'error',
				title: 'Not allowed.'
			},
			{
				status: 401
			}
		);
	}

	// Limit amount of team members. @todo Think about metered pricing for organizations.
	const membersByOrganization = await getMembersAndInvitesByOrganization(userOrganization.id);

	if (membersByOrganization.length >= MAX_ORGANIZATION_TEAM_SIZE) {
		return message(
			form,
			{
				status: 'error',
				title: m.early_honest_grizzly_clasp(),
				description: m.salty_active_toucan_kiss()
			},
			{
				status: 401
			}
		);
	}

	// Handle existing member
	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		const existingMember = await db.query.membership.findFirst({
			where: (fields, { eq, and }) =>
				and(eq(fields.userId, existingUser.id), eq(fields.organizationId, organizationId))
		});

		if (existingMember) {
			return message(
				form,
				{
					status: 'error',
					title: m.vivid_swift_firefox_devour(),
					description: m.white_odd_osprey_adapt()
				},
				{
					status: 401
				}
			);
		}
	}

	// Handle existing invitation
	const [existingInvite] = await db
		.select()
		.from(invite)
		.where(and(eq(invite.organizationId, organizationId), eq(invite.email, email)))
		.limit(1);

	if (existingInvite) {
		if (existingInvite.expiresAt < new Date() || existingInvite.status !== InviteStatus.PENDING) {
			// Invite has expired. We delete it.
			await db.delete(invite).where(eq(invite.id, existingInvite.id));
		} else {
			return message(
				form,
				{
					status: 'error',
					title: m.lost_stock_warthog_care(),
					description: m.tidy_this_fly_aid()
				},
				{
					status: 401
				}
			);
		}
	}

	// Send invite
	await inviteUserToOrganization({
		userId: user.id,
		email,
		name,
		membershipRole: role,
		organizationId
	});

	return message(form, {
		status: 'success',
		title: m.weak_stock_elephant_build(),
		description: m.maroon_light_tern_treat()
	});
};

export const manageOrganizationMember: Action = async (event) => {
	const form = await superValidate(event.request, zod4(manageOrganizationMemberFormSchema()));

	const { organizationId, userId, inviteId, role } = form.data;
	const user = event.locals.user;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	// Make sure user is owner of the organization
	const userOrganizations = await getOrganizationsByUserId(user.id);
	const userOrganization = userOrganizations.find((item) => item.id === organizationId);
	const isOwner = userOrganization?.role === MembershipRole.OWNER;

	if (!organizationId || !userOrganization || !isOwner || !role) {
		return message(form, { status: 'error', title: 'Not allowed.' }, { status: 401 });
	}

	if (userId) {
		if (role !== MembershipRole.OWNER) {
			const owners = await db.query.membership.findMany({
				where: (fields, { eq, and }) =>
					and(eq(fields.organizationId, organizationId), eq(fields.role, MembershipRole.OWNER))
			});

			if (owners.length <= 1 && owners[0].userId === userId) {
				return message(
					form,
					{
						status: 'error',
						title: m.east_major_millipede_support(),
						description: m.front_chunky_shad_zip()
					},
					{ status: 400 }
				);
			}
		}

		const result = await db
			.update(membership)
			.set({ role })
			.where(and(eq(membership.userId, userId), eq(membership.organizationId, organizationId)))
			.returning();

		if (!result.length) {
			return message(form, { status: 'error', title: `Member doesn't exist.` }, { status: 401 });
		}

		return message(form, {
			status: 'success',
			title: m.slow_tense_niklas_adore(),
			description: m.bald_great_flea_splash()
		});
	}

	if (inviteId) {
		const result = await db
			.update(invite)
			.set({ membershipRole: role })
			.where(and(eq(invite.id, inviteId), eq(invite.organizationId, organizationId)))
			.returning();

		if (!result.length) {
			return message(
				form,
				{ status: 'error', title: m.main_orange_okapi_cuddle() },
				{ status: 401 }
			);
		}

		return message(form, {
			status: 'success',
			title: m.just_plane_puffin_explore(),
			description: m.mild_orange_racoon_lend()
		});
	}

	return message(form, { status: 'error', title: m.free_smug_hound_boil() }, { status: 400 });
};

export const removeOrganizationMember: Action = async (event) => {
	const form = await superValidate(event.request, zod4(manageOrganizationMemberFormSchema()));

	const { organizationId, inviteId, userId } = form.data;
	const user = event.locals.user;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	// Make sure user is owner of the organization, OR they are removing themselves
	const userOrganizations = await getOrganizationsByUserId(user.id);
	const userOrganization = userOrganizations.find((item) => item.id === organizationId);

	const isOwner = userOrganization?.role === MembershipRole.OWNER;
	const isSelf = userId === user.id;

	if (!organizationId || !userOrganization || (!isOwner && !isSelf)) {
		return message(
			form,
			{
				status: 'error',
				title: m.tame_mushy_martin_loop()
			},
			{
				status: 401
			}
		);
	}

	if (inviteId) {
		const result = await db.delete(invite).where(eq(invite.id, inviteId)).returning();

		if (!result.length) {
			return message(
				form,
				{
					status: 'error',
					title: m.sunny_minor_platypus_ascend(),
					description: m.gross_weary_rook_stir()
				},
				{
					status: 401
				}
			);
		}

		return message(form, {
			status: 'success',
			title: m.red_loved_grebe_startle(),
			description: m.new_grand_hyena_evoke()
		});
	}

	if (userId) {
		if (isSelf && isOwner) {
			const owners = await db.query.membership.findMany({
				where: (fields, { eq, and }) =>
					and(eq(fields.organizationId, organizationId), eq(fields.role, MembershipRole.OWNER))
			});

			if (owners.length <= 1) {
				return message(
					form,
					{
						status: 'error',
						title: m.cuddly_wide_tiger_yell(),
						description: m.patchy_equal_myna_affirm()
					},
					{
						status: 400
					}
				);
			}
		}

		const result = await db.delete(membership).where(eq(membership.userId, userId)).returning();

		if (!result.length) {
			return message(
				form,
				{
					status: 'error',
					title: m.broad_tasty_fox_slide(),
					description: m.this_home_stingray_yell()
				},
				{
					status: 401
				}
			);
		}

		return message(form, {
			status: 'success',
			title: m.salty_tense_pug_roam(),
			description: m.least_maroon_stork_slide()
		});
	}

	return message(form, { status: 'error', title: m.next_keen_sheep_endure() }, { status: 400 });
};

export const loginWithEmail: Action = async (event) => {
	const form = await superValidate(event.request, zod4(emailFormSchema()));

	if (await isRateLimited(event)) return message(form, rateLimitErrorMessage(), { status: 429 });

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

	try {
		// Restrict login to white-label
		// @todo: refactor this
		await checkIsUserAllowedOnWhiteLabelSite(event.url.hostname, result.id);
	} catch (error) {
		console.error(error);

		return message(
			form,
			{
				status: 'error',
				title: m.livid_wild_crab_loop(),
				description: m.quaint_solid_orangutan_devour()
			},
			{ status: 401 }
		);
	}

	setEmailVerificationCookie(event, email);

	return redirectLocalized(303, '/login/password');
};

export const loginWithPassword: Action = async (event) => {
	const form = await superValidate(event.request, zod4(signInFormSchema()));

	if (await isRateLimited(event)) return message(form, rateLimitErrorMessage(), { status: 429 });

	const { email, password } = form.data;

	if (!form.valid) {
		return fail(400, { form });
	}

	try {
		const [result] = await db.select().from(userSchema).where(eq(userSchema.email, email)).limit(1);

		if (!result?.passwordHash) {
			// Normalize timing: run a dummy scrypt to prevent user-enumeration via response time
			await verifyPassword(password, DUMMY_PASSWORD_HASH);
			throw Error('Invalid credentials.');
		}

		// Restrict login to white-label
		await checkIsUserAllowedOnWhiteLabelSite(event.url.hostname, result.id);

		if (!result.emailVerified) {
			throw Error('Email not verified.');
		}

		const isPasswordValid = await verifyPassword(password, result.passwordHash);
		if (!isPasswordValid) {
			throw Error(`Password doesn't match`);
		}

		// Create session
		await auth.createSession(event, result.id);

		deleteEmailVerificationCookie(event);

		// If user has encryption enabled, return key store data for client-side key derivation
		if (result.encryptionEnabled) {
			const keyStore = await getUserEncryptionKeyStore(result.id);

			if (keyStore) {
				return {
					form,
					keyStore,
					redirect: '/account'
				};
			}
		}

		// Encryption not set up — redirect to encryption setup (client-side navigation to preserve password)
		return {
			form,
			redirect: '/encryption'
		};
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
};

export const signupWithEmail: Action = async (event) => {
	const form = await superValidate(event.request, zod4(emailFormSchema()));

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
		zod4(emailVerificationCodeFormSchema())
	);

	if (await isRateLimited(event))
		return message(verificationForm, rateLimitErrorMessage(), { status: 429 });

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
		const { userId, name } = await createOrUpdateUser({
			email: email,
			emailVerified: true
		});

		// This is only triggered, if new user
		await welcomeNewUser({ email, name });

		// Create session
		await auth.createSession(event, userId);

		// Cleanup DB and Cookies
		await deleteEmailVerificationRequests(email);
		deleteEmailVerificationCookie(event);

		// Check if user has encryption enabled — redirect to recovery flow
		const [existingUser] = await db
			.select({ encryptionEnabled: userSchema.encryptionEnabled })
			.from(userSchema)
			.where(eq(userSchema.id, userId))
			.limit(1);

		if (existingUser?.encryptionEnabled) {
			return redirectLocalized(303, '/recover-encryption');
		}
	} catch (e) {
		console.error(e);
		if (isRedirect(e)) throw e; // SvelteKit needs to handle redirect
		error(500, 'Failed to register');
	}

	return redirectLocalized(303, '/set-password');
};

export const resendEmailVerificationCode: Action = async (event) => {
	const resendForm = await superValidate(event.request, zod4(emailFormSchema()), {
		id: 'resend-form'
	});

	if (await isRateLimited(event))
		return message(resendForm, rateLimitErrorMessage(), { status: 429 });

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
	const form = await superValidate(event.request, zod4(emailFormSchema()));

	if (await isRateLimited(event)) return message(form, rateLimitErrorMessage(), { status: 429 });

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
	const user = event.locals.user;
	if (!user) {
		return redirectLocalized(307, '/login');
	}

	// If encryption is enabled, use the extended schema with current password + re-wrapped key
	if (user.encryptionEnabled) {
		const form = await superValidate(event.request, zod4(passwordChangeWithEncryptionFormSchema()));

		if (await isRateLimited(event)) return message(form, rateLimitErrorMessage(), { status: 429 });

		if (!form.valid) {
			return fail(400, { form });
		}

		const { currentPassword, password, pdkSalt, encryptedMasterKey } = form.data;

		try {
			// Verify current password, or check recovery-verified cookie for recovery flow
			if (currentPassword) {
				if (!(await verifyUserPassword(user.id, currentPassword))) {
					setError(form, 'currentPassword', m.petty_flaky_lynx_boil());
					return { form };
				}
			} else if (!consumeVerificationCookie(event, RECOVERY_VERIFIED_COOKIE, user.id)) {
				return message(
					form,
					{ status: 'error', title: 'Error', description: 'Current password is required.' },
					{ status: 401 }
				);
			}

			const hashedPassword = await scryptHash(password);

			// Update password and re-wrapped encryption key in one transaction
			await db.transaction(async (tx) => {
				await tx
					.update(userSchema)
					.set({ passwordHash: hashedPassword })
					.where(eq(userSchema.id, user.id));

				if (pdkSalt && encryptedMasterKey) {
					await tx
						.update(userEncryptionKey)
						.set({
							pdkSalt,
							encryptedMasterKey
						})
						.where(eq(userEncryptionKey.userId, user.id));
				}
			});
		} catch (e) {
			console.error(e);
			error(500, 'Failed to set password.');
		}

		// Password was just set/changed — grant verification for encryption setup
		setVerificationCookie(event, PASSWORD_VERIFIED_COOKIE, user.id);

		return message(form, {
			status: 'success',
			title: m.flat_moving_finch_assure(),
			description: m.male_ornate_mantis_feel()
		});
	}

	// Original flow for users without encryption
	const passwordForm = await superValidate(event.request, zod4(passwordFormSchema()));

	if (await isRateLimited(event))
		return message(passwordForm, rateLimitErrorMessage(), { status: 429 });

	if (!passwordForm.valid) {
		return fail(400, { form: passwordForm });
	}

	const { password } = passwordForm.data;

	try {
		const hashedPassword = await scryptHash(password);

		await db
			.update(userSchema)
			.set({ passwordHash: hashedPassword })
			.where(eq(userSchema.id, user.id));
	} catch (e) {
		console.error(e);
		error(500, 'Failed to set password.');
	}

	// Password was just set — grant verification for encryption setup
	setVerificationCookie(event, PASSWORD_VERIFIED_COOKIE, user.id);

	return message(passwordForm, {
		status: 'success',
		title: m.flat_moving_finch_assure(),
		description: m.male_ornate_mantis_feel()
	});
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
	const form = await superValidate(event.request, zod4(apiKeyFormSchema()));

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
	const apiKeyForm = await superValidate(event.request, zod4(apiKeyFormSchema()), {
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
	const form = await superValidate(event.request, zod4(whiteLabelMetaSchema()));

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
	const form = await superValidate(event.request, zod4(whiteLabelSiteSchema()), {
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
		// If we add new supported locales, we need to create the entry first
		if (!messagesJson[locale]) {
			messagesJson[locale] = {};
		}

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

// --- Encryption Key Management Actions ---

// Dummy hash for timing normalization when user doesn't exist (prevents user enumeration)
const DUMMY_PASSWORD_HASH = 'deadbeefdeadbeefdeadbeefdeadbeef:64:' + '00'.repeat(64);

export const verifyCurrentPassword: Action = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/login');
	}

	const form = await superValidate(event.request, zod4(passwordFormSchema()));

	if (await isRateLimited(event)) return message(form, rateLimitErrorMessage(), { status: 429 });

	if (!form.valid) {
		return fail(400, { form });
	}

	const user = event.locals.user;
	const { password } = form.data;

	if (!(await verifyUserPassword(user.id, password))) {
		setError(form, 'password', m.petty_flaky_lynx_boil());
		return { form };
	}

	setVerificationCookie(event, PASSWORD_VERIFIED_COOKIE, user.id);

	return message(form, { status: 'success', title: 'Password verified' });
};

export const setupEncryptionKeys: Action = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/login');
	}

	const form = await superValidate(event.request, zod4(encryptionSetupFormSchema()));

	if (await isRateLimited(event)) return message(form, rateLimitErrorMessage(), { status: 429 });

	if (!form.valid) {
		return fail(400, { form });
	}

	const user = event.locals.user;

	if (!consumeVerificationCookie(event, PASSWORD_VERIFIED_COOKIE, user.id)) {
		return message(
			form,
			{ status: 'error', title: 'Error', description: 'Password verification required.' },
			{ status: 401 }
		);
	}

	const {
		pdkSalt,
		pdkIterations,
		encryptedMasterKey,
		recoveryEncryptedMasterKey,
		recoveryKeyHash
	} = form.data;

	try {
		// Check if encryption is already set up
		const existing = await getUserEncryptionKeyStore(user.id);

		if (existing) {
			return message(
				form,
				{ status: 'error', title: 'Error', description: 'Encryption is already set up.' },
				{ status: 400 }
			);
		}

		// Store encryption keys, recovery key, and enable encryption in one transaction
		await db.transaction(async (tx) => {
			await tx.insert(userEncryptionKey).values({
				userId: user.id,
				pdkSalt,
				pdkIterations,
				encryptedMasterKey,
				recoveryEncryptedMasterKey,
				recoveryKeyHash
			});

			await tx
				.update(userSchema)
				.set({ encryptionEnabled: true })
				.where(eq(userSchema.id, user.id));
		});

		return message(form, {
			status: 'success',
			title: 'Success',
			description: 'End-to-end encryption has been set up.'
		});
	} catch (e) {
		console.error(e);
		error(500, 'Failed to set up encryption.');
	}
};

export const setupRecoveryKey: Action = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/login');
	}

	const form = await superValidate(event.request, zod4(recoverySetupFormSchema()));

	if (!form.valid) {
		return fail(400, { form });
	}

	const user = event.locals.user;

	if (!consumeVerificationCookie(event, PASSWORD_VERIFIED_COOKIE, user.id)) {
		return message(
			form,
			{ status: 'error', title: 'Error', description: 'Password verification required.' },
			{ status: 401 }
		);
	}

	const { recoveryEncryptedMasterKey, recoveryKeyHash } = form.data;

	try {
		await db
			.update(userEncryptionKey)
			.set({ recoveryEncryptedMasterKey, recoveryKeyHash })
			.where(eq(userEncryptionKey.userId, user.id));

		return message(form, {
			status: 'success',
			title: 'Success',
			description: 'Recovery key has been saved.'
		});
	} catch (e) {
		console.error(e);
		error(500, 'Failed to save recovery key.');
	}
};

export const verifyRecoveryKey: Action = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/login');
	}

	const form = await superValidate(event.request, zod4(recoveryVerifyFormSchema()), {
		id: 'recovery-form'
	});

	if (await isRateLimited(event)) return message(form, rateLimitErrorMessage(), { status: 429 });

	if (!form.valid) {
		return fail(400, { form });
	}

	const user = event.locals.user;
	const { recoveryKeyHash } = form.data;

	try {
		const keyStore = await getUserEncryptionKeyStore(user.id);

		if (!keyStore?.recoveryKeyHash || !keyStore?.recoveryEncryptedMasterKey) {
			return message(
				form,
				{
					status: 'error',
					title: 'Error',
					description: 'No recovery key has been set up.'
				},
				{ status: 400 }
			);
		}

		const storedBuf = Buffer.from(keyStore.recoveryKeyHash, 'utf8');
		const suppliedBuf = Buffer.from(recoveryKeyHash, 'utf8');
		const hashMatch =
			storedBuf.length === suppliedBuf.length && timingSafeEqual(storedBuf, suppliedBuf);

		if (!hashMatch) {
			return message(
				form,
				{
					status: 'error',
					title: 'Error',
					description: 'Invalid recovery key.'
				},
				{ status: 401 }
			);
		}

		// Prove recovery was verified server-side (checked by setPassword)
		setVerificationCookie(event, RECOVERY_VERIFIED_COOKIE, user.id);

		return {
			form,
			recoveryEncryptedMasterKey: keyStore.recoveryEncryptedMasterKey
		};
	} catch (e) {
		console.error('[verifyRecoveryKey] Unexpected error:', e);
		error(500, 'Failed to verify recovery key.');
	}
};
