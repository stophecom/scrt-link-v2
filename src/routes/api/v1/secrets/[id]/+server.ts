import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { secret } from '$lib/server/db/schema';
import { getWhiteLabelSiteById } from '$lib/server/whiteLabelSite';

export const POST: RequestHandler = async ({ params, url }) => {
	const secretId = params.id;

	const host = url.host;

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

		if (result?.whiteLabelSiteId) {
			const whiteLabelResult = await getWhiteLabelSiteById(result.whiteLabelSiteId);

			if (host !== whiteLabelResult.customDomain) {
				throw Error(`Host mismatch. The secret can't get accessed from this host.`);
			}
		}

		return json({ isPasswordProtected: !!result.passwordHash });
	} catch (e) {
		console.error(e);

		error(400, m.pretty_swift_parrot_ask());
	}
};

// Only available for users with account
export const DELETE: RequestHandler = async ({ params, locals }) => {
	// Using receipt id
	const secretReceiptId = params.id;

	if (!locals.user) {
		error(405, 'Not allowed. You need to be signed in.');
	}

	try {
		if (!secretReceiptId) {
			throw Error('No secret id provided.');
		}

		const [result] = await db.select().from(secret).where(eq(secret.receiptId, secretReceiptId));

		if (!result) {
			throw Error(`No secret with receipt id ${secretReceiptId} found.`);
		}

		if (result.userId !== locals.user.id) {
			throw Error(`User is not owner of the secret you try to delete.`);
		}

		// We update secret, and mark as retrieved.
		await db
			.update(secret)
			.set({ retrievedAt: new Date(), meta: null, content: null })
			.where(eq(secret.receiptId, secretReceiptId));

		return json({ message: m.petty_alive_albatross_stir() });
	} catch (e) {
		console.error(e);
		return error(400, 'Not able to destroy secret.');
	}
};
