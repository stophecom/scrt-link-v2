import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export async function checkIfUserExists(email: string): Promise<boolean> {
	const result = await db.select().from(table.user).where(eq(table.user.email, email)).limit(1);

	return result.length > 0; // If there's a result, the entry exists
}

export async function checkIsEmailVerified(email: string) {
	const [result] = await db.select().from(table.user).where(eq(table.user.email, email)).limit(1);

	return result.emailVerified;
}
