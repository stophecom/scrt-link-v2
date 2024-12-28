import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export async function checkIfUserExists(email: string): Promise<boolean> {
	const result = await db.select().from(table.users).where(eq(table.users.email, email)).limit(1);

	return result.length > 0; // If there's a result, the entry exists
}
