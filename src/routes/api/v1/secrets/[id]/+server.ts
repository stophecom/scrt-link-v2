import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import * as m from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { secret } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ params }) => {
	const secretId = params.id;

	try {
		if (!secretId) {
			throw Error('No secret id provided.');
		}

		const [result] = await db.select().from(secret).where(eq(secret.secretIdHash, secretId));

		if (!result) {
			throw Error(`No secret for id ${secretId}.`);
		}

		if (result?.expiresAt < new Date()) {
			throw Error(`This secret has expired.`);
		}

		if (result?.retrievedAt) {
			throw Error(`This secret has already been accessed and therefore no longer exists.`);
		}
		return json({ isPasswordProtected: !!result.passwordHash });
	} catch (e) {
		console.error(e);

		error(400, m.pretty_swift_parrot_ask());
	}
};
