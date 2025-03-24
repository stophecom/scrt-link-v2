import { and, eq } from 'drizzle-orm';

import { db } from './db';
import { apiKey, type User } from './db/schema';

export const getActiveApiKeys = async (userId: User['id']) =>
	await db
		.select()
		.from(apiKey)
		.where(and(eq(apiKey.userId, userId), eq(apiKey.revoked, false)));
