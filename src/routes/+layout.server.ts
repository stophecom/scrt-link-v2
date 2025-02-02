import { eq } from 'drizzle-orm';

import { getBaseUrl } from '$lib/constants';
import { db } from '$lib/server/db';
import { stats } from '$lib/server/db/schema';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const [result] = await db.select().from(stats).where(eq(stats.id, 1)).limit(1);

	return {
		user: event.locals.user,
		baseUrl: getBaseUrl(),
		totalSecrets: result?.totalSecrets || 0
	};
};
