import { and, eq } from 'drizzle-orm';

import { sha256Hash } from '$lib/client/web-crypto';
import { generateBase64Token } from '$lib/crypto';
import type { MembershipRole } from '$lib/data/enums';
import { DAY } from '$lib/data/units';
import type { PartialExcept } from '$lib/typescript-helpers';

import { db } from './db';
import {
	apiKey,
	invite,
	membership,
	type Organization,
	organization,
	type User,
	user as userSchema,
	userSettings
} from './db/schema';
import { getOrganizationById } from './organization';
import { addContactToAudience } from './resend';
import stripeInstance from './stripe';
import { sendOrganisationInvitationEmail, sendWelcomeEmail } from './transactional-email';

export async function getUserByEmail(email: string) {
	const [result] = await db.select().from(userSchema).where(eq(userSchema.email, email)).limit(1);

	return result;
}

export async function checkIfUserExists(email: string): Promise<boolean> {
	const result = await db.select().from(userSchema).where(eq(userSchema.email, email)).limit(1);

	return result.length > 0; // If there's a result, the entry exists
}

export async function checkIsEmailVerified(email: string) {
	const [result] = await db.select().from(userSchema).where(eq(userSchema.email, email)).limit(1);

	return result.emailVerified;
}

// We use create or update here since a user can "signup" again with a OAuth. (e.g. Google)
// In this case we upsert the existing info.
export const createOrUpdateUser = async ({
	email,
	emailVerified,
	googleId = null,
	name = null,
	picture = null
}: PartialExcept<User, 'email'>) => {
	// All check passed. We create or update user and session.
	const [userResult] = await db
		.insert(userSchema)
		.values({ email, emailVerified, googleId, name, picture })
		.onConflictDoUpdate({
			target: userSchema.email,
			set: { emailVerified, googleId, name, picture }
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

	// Add user settings
	await db
		.insert(userSettings)
		.values({
			userId: userResult.id,
			email: userResult.email
		})
		.onConflictDoUpdate({
			target: userSettings.userId,
			set: {
				email: userResult.email
			}
		});

	return { userId: userResult.id, name: userResult.name };
};

export const welcomeNewUser = async ({ email, name }: Pick<User, 'email' | 'name'>) => {
	const isNewUser = !(await checkIfUserExists(email));

	if (isNewUser) {
		// We add user to MQL list on Resend
		try {
			const result = await addContactToAudience({ email });

			if (result.error) {
				throw Error(result.error.message);
			}
		} catch (error) {
			console.error(`Failed to add contact to Resend.`, JSON.stringify(error));
		}

		// Send welcome email
		try {
			await sendWelcomeEmail(email, name || '');
		} catch (error) {
			console.error(`Failed to send welcome email.`, JSON.stringify(error));
		}
	}
};

export const getActiveApiKeys = async (userId: User['id']) =>
	await db
		.select()
		.from(apiKey)
		.where(and(eq(apiKey.userId, userId), eq(apiKey.revoked, false)));

export const getOrganizationsByUser = async (userId: User['id']) =>
	await db
		.select({
			id: organization.id,
			name: organization.name,
			role: membership.role
		})
		.from(membership)
		.innerJoin(organization, eq(membership.organizationId, organization.id))
		.where(eq(membership.userId, userId));

export const getMembersByOrganization = async (organizationId: Organization['id']) =>
	await db
		.select({
			id: userSchema.id,
			name: userSchema.name,
			email: userSchema.email,
			picture: userSchema.picture,
			role: membership.role
		})
		.from(membership)
		.innerJoin(userSchema, eq(membership.userId, userSchema.id))
		.where(eq(membership.organizationId, organizationId));

type InviteUserToOrganization = {
	userId: string;
	email: string;
	membershipRole: MembershipRole;
	organizationId: string;
};
export const inviteUserToOrganization = async ({
	userId,
	email,
	membershipRole,
	organizationId
}: InviteUserToOrganization) => {
	const otpToken = generateBase64Token();
	const otpTokenHash = await sha256Hash(otpToken);

	const expiresAt = new Date(Date.now() + 7 * DAY);

	await db.insert(invite).values({
		email,
		organizationId,
		membershipRole,
		invitedByUserId: userId,
		token: otpTokenHash,
		expiresAt
	});

	const organization = await getOrganizationById({ organizationId });
	const name = organization.name;

	await sendOrganisationInvitationEmail(email, otpToken, name);
};
