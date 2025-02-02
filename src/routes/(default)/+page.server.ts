import { error } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { scryptHash } from '$lib/crypto';
import { generateRandomUrlSafeString } from '$lib/crypto';
import { getExpiresAtOptions } from '$lib/data/secretSettings';
import * as m from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { secret, stats } from '$lib/server/db/schema';
import { secretTextFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

const CHARACTER_LIMIT = 100_000;

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(secretTextFormSchema(CHARACTER_LIMIT))) // Limit needs to be bigger b/c of encryption.
	};
};

export const actions: Actions = {
	postSecret: async (event) => {
		const form = await superValidate(event.request, zod(secretTextFormSchema(CHARACTER_LIMIT)));

		const { text, password, secretIdHash, meta, expiresAt: expiration } = form.data;

		if (!form.valid) {
			return fail(400, { form });
		}

		// Map expiration date
		const match = getExpiresAtOptions().find((item) => item.value === expiration);
		if (!match?.ms) {
			throw Error('No expiration time found.');
		}

		const expiresAt = new Date(Date.now() + match.ms);

		let passwordHash;

		try {
			if (password) {
				passwordHash = await scryptHash(password);
			}

			// Attach user to secret, if exists
			const user = event.locals.user;
			const receiptId = generateRandomUrlSafeString(8);

			await db.insert(secret).values({
				secretIdHash,
				meta,
				content: text,
				passwordHash,
				expiresAt,
				receiptId,
				userId: user?.id
			});

			// Global stats
			await db
				.insert(stats)
				.values({ id: 1, scope: 'global' })
				.onConflictDoUpdate({
					target: stats.id,
					set: { totalSecrets: sql`${stats.totalSecrets} + 1` }
				});

			// Individual user stats
			if (user) {
				await db
					.insert(stats)
					.values({
						userId: user.id,
						scope: 'user'
					})
					.onConflictDoUpdate({
						target: stats.userId,
						set: { totalSecrets: sql`${stats.totalSecrets} + 1` }
					});
			}
			const expirationMessage = m.real_actual_cockroach_type({
				time: getExpiresAtOptions().find((item) => item.value === expiration)?.label || ''
			});

			const readReceiptMessage = m.deft_lucky_quail_pause({ receiptId });

			return message(form, {
				status: 'success',
				description: [expirationMessage, ...(user ? [readReceiptMessage] : [])].join(' ')
			});
		} catch (e) {
			console.error(e);
			error(500, `Couldn't save secret.`);
		}
	}
};
