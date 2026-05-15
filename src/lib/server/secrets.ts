import { SecretType } from '@scrt-link/core';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';

import { generateRandomAlphanumericString, scryptHash } from '$lib/crypto';
import type { SecretFormSchema } from '$lib/validators/formSchemas';

import { db } from './db';
import { type Secret, secret, stats } from './db/schema';

// Returns the TypeScript property name (camelCase) used by Drizzle's onConflictDoUpdate set.
// Column.name returns the SQL snake_case name which Drizzle does not recognize in set objects.
const getSecretTypeStatsKey = (
	secretType?: SecretType
):
	| keyof Pick<
			typeof stats.$inferInsert,
			'textSecrets' | 'fileSecrets' | 'redirectSecrets' | 'snapSecrets' | 'neogramSecrets'
	  >
	| null => {
	switch (secretType) {
		case SecretType.TEXT:
			return 'textSecrets';
		case SecretType.FILE:
			return 'fileSecrets';
		case SecretType.REDIRECT:
			return 'redirectSecrets';
		case SecretType.SNAP:
			return 'snapSecrets';
		case SecretType.NEOGRAM:
			return 'neogramSecrets';
		default:
			return null;
	}
};

const getSecretTypeStatsColumn = (secretType?: SecretType) => {
	switch (secretType) {
		case SecretType.TEXT:
			return stats.textSecrets;
		case SecretType.FILE:
			return stats.fileSecrets;
		case SecretType.REDIRECT:
			return stats.redirectSecrets;
		case SecretType.SNAP:
			return stats.snapSecrets;
		case SecretType.NEOGRAM:
			return stats.neogramSecrets;
		default:
			return null;
	}
};

type SaveSecret = {
	userId?: string;
	secretRequest: SecretFormSchema;
	secretType?: SecretType;
	whiteLabelSiteId?: string;
};
export const saveSecret = async ({
	userId,
	secretRequest,
	secretType,
	whiteLabelSiteId
}: SaveSecret) => {
	const { content, publicNote, password, secretIdHash, meta, expiresIn, publicKey, viewLimit } =
		secretRequest;

	let passwordHash: string | undefined;
	if (password) {
		passwordHash = await scryptHash(password);
	}

	// Attach user to secret, if exists
	const receiptId = generateRandomAlphanumericString(8);

	// Build type-specific stats increment using TypeScript property names (not SQL column names).
	const typeColumn = getSecretTypeStatsColumn(secretType);
	const typeKey = getSecretTypeStatsKey(secretType);
	const typeInitial = typeKey ? { [typeKey]: 1 } : {};
	const typeIncrement = typeColumn && typeKey ? { [typeKey]: sql`${typeColumn} + 1` } : {};

	const result = await db.transaction(async (tx) => {
		const [row] = await tx
			.insert(secret)
			.values({
				secretIdHash,
				meta,
				content,
				publicNote,
				passwordHash,
				expiresAt: new Date(Date.now() + expiresIn),
				publicKey,
				viewLimit,
				receiptId,
				userId: userId,
				whiteLabelSiteId: whiteLabelSiteId
			})
			.returning();

		// Global stats
		await tx
			.insert(stats)
			.values({ id: 1, scope: 'global', totalSecrets: 1, ...typeInitial })
			.onConflictDoUpdate({
				target: stats.id,
				set: { totalSecrets: sql`${stats.totalSecrets} + 1`, ...typeIncrement }
			});

		// Individual user stats
		if (userId) {
			await tx
				.insert(stats)
				.values({ userId, scope: 'user', totalSecrets: 1, ...typeInitial })
				.onConflictDoUpdate({
					target: stats.userId,
					set: { totalSecrets: sql`${stats.totalSecrets} + 1`, ...typeIncrement }
				});
		}

		// WhiteLabel stats
		if (whiteLabelSiteId) {
			await tx
				.insert(stats)
				.values({ whiteLabelSiteId, scope: 'whiteLabel', totalSecrets: 1, ...typeInitial })
				.onConflictDoUpdate({
					target: stats.whiteLabelSiteId,
					set: { totalSecrets: sql`${stats.totalSecrets} + 1`, ...typeIncrement }
				});
		}

		return row;
	});

	return { receiptId, expiresIn, expiresAt: result.expiresAt };
};

type FetchSecrets = {
	userId: string;
	whiteLabelSiteId?: string;
};
export const fetchSecrets = async ({ userId, whiteLabelSiteId }: FetchSecrets) => {
	// In case we are on a white-label site, we filter secrets accordingly
	const conditions = [eq(secret.userId, userId)];

	if (whiteLabelSiteId) {
		conditions.push(eq(secret.whiteLabelSiteId, whiteLabelSiteId));
	} else {
		conditions.push(isNull(secret.whiteLabelSiteId));
	}

	let secrets: ({ destroyed: boolean } & Pick<
		Secret,
		'receiptId' | 'expiresAt' | 'retrievedAt' | 'publicNote'
	>)[] = [];
	const secretList = await db
		.select()
		.from(secret)
		.where(and(...conditions))
		.orderBy(desc(secret.expiresAt));

	if (secretList.length) {
		secrets = secretList.map(({ receiptId, expiresAt, retrievedAt, publicNote, meta }) => ({
			receiptId,
			expiresAt,
			retrievedAt,
			publicNote,
			destroyed: !meta
		}));
	}
	return secrets;
};
