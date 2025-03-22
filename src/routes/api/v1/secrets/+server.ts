import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { apiKey } from '$lib/server/db/schema';
import { user } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request }) => {
	const authorizationHeader = request.headers.get('authorization');

	if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
		const token = authorizationHeader.split(' ')[1];
		console.log(token);

		const [result] = await db
			.select()
			.from(apiKey)
			.leftJoin(user, eq(user.id, apiKey.userId))
			.where(eq(apiKey.key, token));

		if (!result) {
			error(400, `Invalid API key`);
		}
	}

	return json({ success: true });
};
