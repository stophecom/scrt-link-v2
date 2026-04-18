import { sql } from 'drizzle-orm';
import type { RateLimiterStore } from 'sveltekit-rate-limiter/server';

import { db } from './db';
import { rateLimit } from './db/schema';

/**
 * Postgres-backed store for sveltekit-rate-limiter. The default in-memory TTLStore
 * is unsafe on serverless (each lambda instance has its own cache — counters don't
 * cross instances). This store shares state across all instances via the DB.
 *
 * Matches TTLStore's fixed-window semantics: the window's expiry is set on the
 * first hit and NOT extended by subsequent hits in the same window.
 */
export class PostgresRateLimiterStore implements RateLimiterStore {
	async add(hash: string, ttl: number): Promise<number> {
		const expiresAt = new Date(Date.now() + ttl);

		const [row] = await db
			.insert(rateLimit)
			.values({ hash, count: 1, expiresAt })
			.onConflictDoUpdate({
				target: rateLimit.hash,
				set: {
					count: sql`CASE WHEN ${rateLimit.expiresAt} <= NOW() THEN 1 ELSE ${rateLimit.count} + 1 END`,
					expiresAt: sql`CASE WHEN ${rateLimit.expiresAt} <= NOW() THEN ${expiresAt} ELSE ${rateLimit.expiresAt} END`
				}
			})
			.returning({ count: rateLimit.count });

		return row.count;
	}

	async clear(): Promise<void> {
		await db.delete(rateLimit);
	}
}
