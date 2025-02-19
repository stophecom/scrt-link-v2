import { error } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { scryptHash } from '$lib/crypto';
import { generateRandomUrlSafeString } from '$lib/crypto';
import * as m from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { secret, stats } from '$lib/server/db/schema';
import { secretFormSchema } from '$lib/validators/formSchemas';

import { getExpiresInOptions } from '../../lib/data/secretSettings';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(secretFormSchema()))
	};
};

export const actions: Actions = {
	postSecret: async (event) => {
		const form = await superValidate(event.request, zod(secretFormSchema()));

		const { content, password, secretIdHash, meta, expiresIn, publicKey } = form.data;

		if (!form.valid) {
			return fail(400, { form });
		}

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
				content,
				passwordHash,
				expiresAt: new Date(Date.now() + expiresIn),
				publicKey,
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
				time: getExpiresInOptions().find((item) => item.value === expiresIn)?.label || ''
			});

			const readReceiptMessage = m.deft_lucky_quail_pause({ receiptId });

			return message(form, {
				status: 'success',
				description: [expirationMessage, ...(user ? [readReceiptMessage] : [])].join('\n\n')
			});
		} catch (e) {
			console.error(e);
			error(500, `Couldn't save secret.`);
		}
	}
};
