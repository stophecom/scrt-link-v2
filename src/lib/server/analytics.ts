import { count, eq, sql } from 'drizzle-orm';

import { TierOptions } from '$lib/data/enums';

import { db } from './db';
import {
	apiKey,
	membership,
	organization,
	secret,
	secretRequest,
	stats,
	user,
	whiteLabelSite
} from './db/schema';

// ── Users ──────────────────────────────────────────────

export const getTotalUsers = async () => {
	const [result] = await db.select({ count: count() }).from(user);
	return result.count;
};

export const getUsersByTier = async () => {
	const result = await db
		.select({
			tier: user.subscriptionTier,
			count: count()
		})
		.from(user)
		.groupBy(user.subscriptionTier);
	return result;
};

export const getUserSignupsByMonth = async (months = 12) => {
	const result = await db
		.select({
			month: sql<string>`to_char(date_trunc('month', ${user.createdAt}), 'YYYY-MM')`,
			count: count()
		})
		.from(user)
		.where(sql`${user.createdAt} > now() - interval '${sql.raw(String(months))} months'`)
		.groupBy(sql`date_trunc('month', ${user.createdAt})`)
		.orderBy(sql`date_trunc('month', ${user.createdAt})`);
	return result;
};

export const getRecentSignups = async (limit = 20) => {
	const result = await db
		.select({
			email: user.email,
			name: user.name,
			tier: user.subscriptionTier,
			encryptionEnabled: user.encryptionEnabled,
			createdAt: user.createdAt
		})
		.from(user)
		.orderBy(sql`${user.createdAt} DESC`)
		.limit(limit);
	return result;
};

export const getAdoptionRates = async () => {
	const [result] = await db
		.select({
			total: count(),
			encryptionEnabled: count(sql`CASE WHEN ${user.encryptionEnabled} = true THEN 1 END`),
			emailVerified: count(sql`CASE WHEN ${user.emailVerified} = true THEN 1 END`)
		})
		.from(user);
	return {
		total: result.total,
		encryptionEnabled: result.encryptionEnabled,
		emailVerified: result.emailVerified,
		encryptionRate: result.total > 0 ? result.encryptionEnabled / result.total : 0,
		emailVerificationRate: result.total > 0 ? result.emailVerified / result.total : 0
	};
};

// ── Secrets & Stats ────────────────────────────────────

export const getGlobalStats = async () => {
	const [result] = await db.select().from(stats).where(eq(stats.scope, 'global'));
	return result ?? null;
};

export const getTopUsersBySecrets = async (limit = 20) => {
	const result = await db
		.select({
			email: user.email,
			name: user.name,
			tier: user.subscriptionTier,
			totalSecrets: stats.totalSecrets
		})
		.from(stats)
		.innerJoin(user, eq(user.id, stats.userId))
		.where(eq(stats.scope, 'user'))
		.orderBy(sql`${stats.totalSecrets} DESC`)
		.limit(limit);
	return result;
};

export const getSecretCounts = async () => {
	const [result] = await db
		.select({
			total: count(),
			pending: count(
				sql`CASE WHEN ${secret.meta} IS NOT NULL AND ${secret.retrievedAt} IS NULL THEN 1 END`
			),
			retrieved: count(sql`CASE WHEN ${secret.retrievedAt} IS NOT NULL THEN 1 END`),
			withPassword: count(sql`CASE WHEN ${secret.passwordHash} IS NOT NULL THEN 1 END`)
		})
		.from(secret);
	return result;
};

// ── Secret Requests ────────────────────────────────────

export const getSecretRequestStats = async () => {
	const [result] = await db
		.select({
			total: count(),
			responded: count(sql`CASE WHEN ${secretRequest.respondedAt} IS NOT NULL THEN 1 END`),
			viewed: count(sql`CASE WHEN ${secretRequest.viewedAt} IS NOT NULL THEN 1 END`),
			pending: count(
				sql`CASE WHEN ${secretRequest.respondedAt} IS NULL AND ${secretRequest.expiresAt} > now() THEN 1 END`
			),
			expired: count(
				sql`CASE WHEN ${secretRequest.respondedAt} IS NULL AND ${secretRequest.expiresAt} <= now() THEN 1 END`
			)
		})
		.from(secretRequest);
	return result;
};

// ── Organizations ──────────────────────────────────────

export const getTotalOrganizations = async () => {
	const [result] = await db.select({ count: count() }).from(organization);
	return result.count;
};

export const getOrganizationSizes = async () => {
	const result = await db
		.select({
			orgId: organization.id,
			name: organization.name,
			memberCount: count(membership.userId),
			totalSecrets: sql<number>`coalesce(sum(${stats.totalSecrets}), 0)`
		})
		.from(organization)
		.innerJoin(membership, eq(membership.organizationId, organization.id))
		.leftJoin(stats, sql`${stats.userId} = ${membership.userId} AND ${stats.scope} = 'user'`)
		.groupBy(organization.id, organization.name)
		.orderBy(sql`coalesce(sum(${stats.totalSecrets}), 0) DESC`);
	return result;
};

// ── Subscriptions & Revenue ────────────────────────────

export const getActiveSubscriptions = async () => {
	const [result] = await db
		.select({ count: count() })
		.from(user)
		.where(sql`${user.subscriptionTier} != ${TierOptions.CONFIDENTIAL}`);
	return result.count;
};

// ── API Keys ───────────────────────────────────────────

export const getApiKeyStats = async () => {
	const [result] = await db
		.select({
			total: count(),
			active: count(sql`CASE WHEN ${apiKey.revoked} = false THEN 1 END`),
			usersWithKeys: count(sql`DISTINCT ${apiKey.userId}`)
		})
		.from(apiKey);
	return result;
};

// ── White Label ────────────────────────────────────────

export const getWhiteLabelStats = async () => {
	const [result] = await db
		.select({
			total: count(),
			published: count(sql`CASE WHEN ${whiteLabelSite.published} = true THEN 1 END`)
		})
		.from(whiteLabelSite);
	return result;
};
