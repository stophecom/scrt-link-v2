import { error } from '@sveltejs/kit';
import { and, eq, isNull, lt, sql } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { verifyPassword } from '$lib/crypto';
import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { secret as secretSchema, user as userSchema, userSettings } from '$lib/server/db/schema';
import { sendReadReceiptEmail } from '$lib/server/transactional-email';
import { revealSecretFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

const MAX_PASSWORD_ATTEMPTS = 5;

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(revealSecretFormSchema()))
	};
};

export const actions: Actions = {
	default: async (event) => {
		// We make password optional since not all secrets are encrypted with an extra password.
		const partialSchema = revealSecretFormSchema().partial({ password: true });
		const form = await superValidate(event.request, zod4(partialSchema));

		const { password, secretIdHash } = form.data;

		if (!form.valid) {
			return fail(400, { form });
		}

		const [result] = await db
			.select()
			.from(secretSchema)
			.leftJoin(userSchema, eq(userSchema.id, secretSchema.userId))
			.where(eq(secretSchema.secretIdHash, secretIdHash));

		if (!result) {
			error(400, `No secret for id ${secretIdHash}.`);
		}

		const {
			passwordHash,
			passwordAttempts,
			meta,
			content,
			expiresAt,
			userId,
			receiptId,
			retrievedAt
		} = result.secret;

		// Secret already definitively exhausted (retrievedAt is immutable once set).
		if (retrievedAt !== null) {
			return message(
				form,
				{
					status: 'error',
					title: m.sad_arable_canary_mop(),
					description: m.stale_slow_halibut_spur()
				},
				{ status: 401 }
			);
		}

		// Secret has expired.
		if (expiresAt < new Date()) {
			return message(
				form,
				{
					status: 'error',
					title: m.sad_arable_canary_mop(),
					description: m.stale_slow_halibut_spur()
				},
				{ status: 401 }
			);
		}

		// Too many password attempts
		if (passwordAttempts + 1 >= MAX_PASSWORD_ATTEMPTS) {
			return message(
				form,
				{
					status: 'error',
					title: m.teary_main_bee_praise(),
					description: m.vivid_vivid_peacock_slurp()
				},
				{ status: 401 }
			);
		}

		// Password verification
		if (password && passwordHash) {
			const isPasswordValid = await verifyPassword(password, passwordHash);
			if (!isPasswordValid) {
				const [result] = await db
					.update(secretSchema)
					.set({
						passwordAttempts: sql`${secretSchema.passwordAttempts} + 1`
					})
					.where(eq(secretSchema.secretIdHash, secretIdHash))
					.returning();

				return message(
					form,
					{
						status: 'error',
						title: m.flat_novel_alpaca_scold(),
						description: m.icy_heavy_toucan_harbor({
							amount: MAX_PASSWORD_ATTEMPTS - result.passwordAttempts
						})
					},
					{ status: 401 }
				);
			}
		}

		// Atomic conditional increment — only succeeds if a view slot is still available.
		// Postgres row-level locking serializes concurrent requests, preventing two simultaneous
		// requests from both claiming the last view slot.
		const [updated] = await db
			.update(secretSchema)
			.set({
				viewCount: sql`${secretSchema.viewCount} + 1`,
				retrievedAt: sql`CASE WHEN ${secretSchema.viewCount} + 1 >= ${secretSchema.viewLimit} THEN NOW() ELSE NULL END`
			})
			.where(
				and(
					eq(secretSchema.secretIdHash, secretIdHash),
					isNull(secretSchema.retrievedAt),
					lt(secretSchema.viewCount, secretSchema.viewLimit)
				)
			)
			.returning();

		if (!updated) {
			// A concurrent request claimed the last slot between our SELECT and this UPDATE.
			return message(
				form,
				{
					status: 'error',
					title: m.sad_arable_canary_mop(),
					description: m.stale_slow_halibut_spur()
				},
				{ status: 401 }
			);
		}

		const newViewCount = updated.viewCount;
		const isLastView = updated.viewCount >= updated.viewLimit;

		// Read receipts — sent after the successful DB update.
		if (userId) {
			try {
				const [userWithSettings] = await db
					.select()
					.from(userSettings)
					.where(eq(userSettings.userId, userId));

				if (!userWithSettings) {
					throw Error('User has no settings.');
				}

				const { readReceipt, ntfyEndpoint, email } = userWithSettings;

				// Send receipt via email
				if (readReceipt === 'email' && receiptId) {
					if (!email) {
						throw Error('No email for read receipt.');
					}

					await sendReadReceiptEmail(email, receiptId, newViewCount, updated.viewLimit, isLastView);
				}

				// Send receipt via ntfy
				if (readReceipt === 'ntfy' && receiptId) {
					if (!ntfyEndpoint) {
						throw Error('No ntfyEndpoint for read receipt.');
					}
					const body = isLastView
						? m.vexed_early_lemming_engage()
						: m.aware_neat_moth_count({ viewCount: newViewCount, viewLimit: updated.viewLimit });

					await fetch(`https://ntfy.sh/${ntfyEndpoint}`, {
						method: 'POST',
						body: `${body} ${receiptId}`,
						headers: {
							Title: m.spry_bald_guppy_cry(),
							Priority: isLastView ? 'urgent' : 'default',
							Tags: isLastView ? 'fire' : 'eyes'
						}
					});

					console.log(`Send read receipt to ${ntfyEndpoint} endpoint.`);
				}
			} catch (e) {
				// We catch errors since it is not critical for the recipient
				console.error(e);
			}
		}

		return { form, meta, content };
	}
};
