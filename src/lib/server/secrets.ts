import { and, desc, eq, isNull, sql } from 'drizzle-orm';

import { isOriginalHost } from '$lib/app-routing';
import { generateRandomUrlSafeString, scryptHash } from '$lib/crypto';
import type { SecretFormSchema } from '$lib/validators/formSchemas';

import { db } from './db';
import { type Secret, secret, stats, whiteLabelSite } from './db/schema';

type SaveSecret = {
	userId?: string;
	secretRequest: SecretFormSchema;
	host?: string;
};
export const saveSecret = async ({ userId, secretRequest, host }: SaveSecret) => {
	const { content, publicNote, password, secretIdHash, meta, expiresIn, publicKey } = secretRequest;

	let whiteLabelSiteId;

	if (host && !isOriginalHost(host)) {
		const [whiteLabelResult] = await db
			.select()
			.from(whiteLabelSite)
			.where(eq(whiteLabelSite.customDomain, host));

		whiteLabelSiteId = whiteLabelResult.id;
	}

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

	// WhiteLabel stats
	if (whiteLabelSiteId) {
		await db
			.insert(stats)
			.values({
				whiteLabelSiteId: whiteLabelSiteId,
				scope: 'whiteLabel'
			})
			.onConflictDoUpdate({
				target: stats.whiteLabelSiteId,
				set: { totalSecrets: sql`${stats.totalSecrets} + 1` }
			});
	}

	return { receiptId, expiresIn, expiresAt: result.expiresAt };
};

type FetchSecrets = {
	userId: string;
	host?: string;
};
export const fetchSecrets = async ({ userId, host }: FetchSecrets) => {
	let whiteLabelSiteId;

	if (host && !isOriginalHost(host)) {
		const [whiteLabelResult] = await db
			.select()
			.from(whiteLabelSite)
			.where(eq(whiteLabelSite.customDomain, host));

		whiteLabelSiteId = whiteLabelResult.id;
	}

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
