import { and, eq } from 'drizzle-orm';

import { verifyPassword } from '$lib/crypto';
import type { PartialExcept } from '$lib/typescript-helpers';

import { db } from './db';
import {
	apiKey,
	type User,
	user as userSchema,
	userEncryptionKey,
	userSettings
} from './db/schema';
import { addContactToAudience } from './resend';
import stripeInstance from './stripe';
import { sendWelcomeEmail } from './transactional-email';

// --- Encryption Key Management Actions ---

// Dummy hash for timing normalization when user doesn't exist (prevents user enumeration)
const DUMMY_PASSWORD_HASH = 'deadbeefdeadbeefdeadbeefdeadbeef:64:' + '00'.repeat(64);

/**
 * Get the encryption key store for a user. Returns null if no keys are set up.
 */
export async function getUserEncryptionKeyStore(userId: User['id']) {
	const [keyStore] = await db
		.select({
			pdkSalt: userEncryptionKey.pdkSalt,
			pdkIterations: userEncryptionKey.pdkIterations,
			encryptedMasterKey: userEncryptionKey.encryptedMasterKey,
			recoveryKeyHash: userEncryptionKey.recoveryKeyHash,
			recoveryEncryptedMasterKey: userEncryptionKey.recoveryEncryptedMasterKey
		})
		.from(userEncryptionKey)
		.where(eq(userEncryptionKey.userId, userId))
		.limit(1);

	return keyStore ?? null;
}

/**
 * Verify a user's password against the stored hash.
 * Returns true if valid, false if invalid or no password set.
 */
export async function verifyUserPassword(userId: User['id'], password: string): Promise<boolean> {
	const [userData] = await db
		.select({ passwordHash: userSchema.passwordHash })
		.from(userSchema)
		.where(eq(userSchema.id, userId))
		.limit(1);

	if (!userData?.passwordHash) {
		// Normalize timing: run a dummy scrypt to prevent user-enumeration via response time
		await verifyPassword(password, DUMMY_PASSWORD_HASH);
		throw Error('Invalid credentials.');
	}

	if (!userData?.passwordHash) {
		return false;
	}

	return verifyPassword(password, userData.passwordHash);
}

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
	googleId,
	name,
	picture
}: PartialExcept<User, 'email'>) => {
	// Only include explicitly provided fields in the update set,
	// so we don't overwrite existing values (e.g. name) with null.
	const updateSet: Partial<Pick<User, 'emailVerified' | 'googleId' | 'name' | 'picture'>> = {
		emailVerified
	};
	if (googleId !== undefined) updateSet.googleId = googleId;
	if (name !== undefined) updateSet.name = name;
	if (picture !== undefined) updateSet.picture = picture;

	const [userResult] = await db
		.insert(userSchema)
		.values({
			email,
			emailVerified,
			googleId: googleId ?? null,
			name: name ?? null,
			picture: picture ?? null
		})
		.onConflictDoUpdate({
			target: userSchema.email,
			set: updateSet
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

	return { userId: userResult.id, ...userResult };
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
