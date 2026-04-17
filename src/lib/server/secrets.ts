import { SecretType } from '@scrt-link/core';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';

import { generateRandomAlphanumericString, scryptHash } from '$lib/crypto';
import type { SecretFormSchema } from '$lib/validators/formSchemas';

import { db } from './db';
import { type Secret, secret, stats } from './db/schema';

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
	const { content, publicNote, password, secretIdHash, meta, expiresIn, publicKey } = secretRequest;

	let passwordHash: string | undefined;
	if (password) {
		passwordHash = await scryptHash(password);
	}

	// Attach user to secret, if exists
	const receiptId = generateRandomAlphanumericString(8);

	// Build type-specific stats increment
	const typeColumn = getSecretTypeStatsColumn(secretType);
	const typeIncrement = typeColumn ? { [typeColumn.name]: sql`${typeColumn} + 1` } : {};

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
				receiptId,
				userId: userId,
				whiteLabelSiteId: whiteLabelSiteId
			})
			.returning();

		// Global stats
		await tx
			.insert(stats)
			.values({ id: 1, scope: 'global' })
			.onConflictDoUpdate({
				target: stats.id,
				set: { totalSecrets: sql`${stats.totalSecrets} + 1`, ...typeIncrement }
			});

		// Individual user stats
		if (userId) {
			await tx
				.insert(stats)
				.values({
					userId: userId,
					scope: 'user'
				})
				.onConflictDoUpdate({
					target: stats.userId,
					set: { totalSecrets: sql`${stats.totalSecrets} + 1`, ...typeIncrement }
				});
		}

		// WhiteLabel stats
		if (whiteLabelSiteId) {
			await tx
				.insert(stats)
				.values({
					whiteLabelSiteId: whiteLabelSiteId,
					scope: 'whiteLabel'
				})
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
