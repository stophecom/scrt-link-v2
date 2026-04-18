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
		// Compute the window end in SQL (NOW() + ttl ms) rather than passing a JS Date
		// through raw sql`` — Drizzle serializes Date via toString() inside a raw template
		// and Postgres rejects the resulting format.
		const [row] = await db
			.insert(rateLimit)
			.values({ hash, count: 1, expiresAt: new Date(Date.now() + ttl) })
			.onConflictDoUpdate({
				target: rateLimit.hash,
				set: {
					count: sql`CASE WHEN ${rateLimit.expiresAt} <= NOW() THEN 1 ELSE ${rateLimit.count} + 1 END`,
					expiresAt: sql`CASE WHEN ${rateLimit.expiresAt} <= NOW() THEN NOW() + ${ttl} * INTERVAL '1 millisecond' ELSE ${rateLimit.expiresAt} END`
				}
			})
			.returning({ count: rateLimit.count });

		return row.count;
	}

	async clear(): Promise<void> {
		await db.delete(rateLimit);
	}
}
