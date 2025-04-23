import { sql } from 'drizzle-orm';

import { generateRandomUrlSafeString, scryptHash } from '$lib/crypto';
import type { SecretFormSchema } from '$lib/validators/formSchemas';

import { db } from './db';
import { secret, stats } from './db/schema';

type SaveSecret = {
	userId?: string;
	secretRequest: SecretFormSchema;
};
export const saveSecret = async ({ userId, secretRequest }: SaveSecret) => {
	const { content, password, secretIdHash, meta, expiresIn, publicKey } = secretRequest;

	let passwordHash;
	if (password) {
		passwordHash = await scryptHash(password);
	}

	// Attach user to secret, if exists
	const receiptId = generateRandomUrlSafeString(8);

	const [result] = await db
		.insert(secret)
		.values({
			secretIdHash,
			meta,
			content,
			passwordHash,
			expiresAt: new Date(Date.now() + expiresIn),
			publicKey,
			receiptId,
			userId: userId
		})
		.returning();

	// Global stats
	await db
		.insert(stats)
		.values({ id: 1, scope: 'global' })
		.onConflictDoUpdate({
			target: stats.id,
			set: { totalSecrets: sql`${stats.totalSecrets} + 1` }
		});

	// Individual user stats
	if (userId) {
		await db
			.insert(stats)
			.values({
				userId: userId,
				scope: 'user'
			})
			.onConflictDoUpdate({
				target: stats.userId,
				set: { totalSecrets: sql`${stats.totalSecrets} + 1` }
			});
	}

	return { receiptId, expiresIn, expiresAt: result.expiresAt };
};
