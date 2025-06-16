import { and, eq } from 'drizzle-orm';

import type { PartialExcept } from '$lib/typescript-helpers';

import { db } from './db';
import {
	apiKey,
	membership,
	organization,
	type User,
	user as userSchema,
	userSettings
} from './db/schema';
import { addContactToAudience } from './resend';
import stripeInstance from './stripe';
import { sendWelcomeEmail } from './transactional-email';

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
	const isNewUser = !(await checkIfUserExists(email));

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

	return { userId: userResult.id };
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
