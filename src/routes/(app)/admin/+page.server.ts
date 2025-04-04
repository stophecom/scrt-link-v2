import { eq, sql } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { stats } from '$lib/server/db/schema';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const userStats = await db
		.select()
		.from(stats)
		.where(eq(stats.scope, 'user'))
		.leftJoin(user, eq(user.id, stats.userId))
		.orderBy(sql`total_secrets DESC`)
		.limit(20);

	return {
		userStats: userStats
	};
};
