import { and, eq, isNull } from 'drizzle-orm';

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
import { addContactToAudience } from './email';
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
	// Determine newness before the upsert — afterwards the row always exists.
	const isNewUser = !(await checkIfUserExists(email));

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
			picture: picture ?? null,
			// Only new accounts get the welcome wizard. On conflict we use `updateSet`
			// (which omits preferences), so existing users' preferences are untouched.
			preferences: { showWelcomeWizard: true }
		})
		.onConflictDoUpdate({
			target: userSchema.email,
			set: updateSet
		})
		.returning();

	// Note: We no longer create a Stripe customer here. A personal Stripe customer
	// is created lazily on first checkout (see src/routes/api/v1/plans/checkout/+server.ts),
	// mirroring how organizations handle it.

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

	return { userId: userResult.id, isNewUser, ...userResult };
};

// `isNewUser` must come from createOrUpdateUser (computed before the upsert).
// We can't re-derive it here: the user row already exists by the time this runs.
export const welcomeNewUser = async ({
	email,
	name,
	isNewUser
}: Pick<User, 'email' | 'name'> & { isNewUser: boolean }) => {
	if (!isNewUser) return;

	// We add user to MQL list on Brevo
	try {
		await addContactToAudience({ email });
	} catch (error) {
		console.error(`Failed to add contact to Brevo.`, JSON.stringify(error));
	}

	// Send welcome email
	try {
		await sendWelcomeEmail(email, name || '');
	} catch (error) {
		console.error(`Failed to send welcome email.`, JSON.stringify(error));
	}
};

export const getActiveApiKeys = async (userId: User['id']) =>
	await db
		.select()
		.from(apiKey)
		.where(
			and(eq(apiKey.userId, userId), eq(apiKey.revoked, false), isNull(apiKey.organizationId))
		);
