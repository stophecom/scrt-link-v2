import { error } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { render } from 'svelte/server';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { verifyPassword } from '$lib/crypto';
import EmailReadReceipt from '$lib/emails/email-read-receipt.svelte';
import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { secret as secretSchema, user as userSchema, userSettings } from '$lib/server/db/schema';
import sendTransactionalEmail from '$lib/server/resend';
import { revealSecretFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

const MAX_PASSWORD_ATTEMPTS = 5;

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(revealSecretFormSchema()))
	};
};

export const actions: Actions = {
	default: async (event) => {
		// We make password optional since not all secrets are encrypted with an extra password.
		const partialSchema = revealSecretFormSchema().partial({ password: true });
		const form = await superValidate(event.request, zod(partialSchema));

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

		// Secret has been accessed.
		if (retrievedAt !== null) {
			error(400, `Secret expired: ${secretIdHash}.`);
		}

		// Secret has expired.
		if (expiresAt < new Date()) {
			return message(
				form,
				{
					status: 'error',
					title: 'Secret expired',
					description: 'The secret is no longer available.'
				},
				{
					status: 401
				}
			);
		}

		// Too many password attepmts
		if (passwordAttempts + 1 >= MAX_PASSWORD_ATTEMPTS) {
			return message(
				form,
				{
					status: 'error',
					title: m.teary_main_bee_praise(),
					description: m.vivid_vivid_peacock_slurp()
				},
				{
					status: 401
				}
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
						title: 'Wrong password!',
						description: m.icy_heavy_toucan_harbor({
							amount: MAX_PASSWORD_ATTEMPTS - result.passwordAttempts
						})
					},
					{
						status: 401
					}
				);
			}
		}

		// Read receipts
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

					const { html } = render(EmailReadReceipt, { props: { receiptId } });
					await sendTransactionalEmail({
						subject: m.spry_bald_guppy_cry(),
						to: email,
						html: html
					});
					console.log(`Send read receipt to ${email}.`);
				}

				// Send receipt via ntfy
				if (readReceipt === 'ntfy' && receiptId) {
					if (!ntfyEndpoint) {
						throw Error('No ntfyEndpoint for read receipt.');
					}
					const body = m.vexed_early_lemming_engage();

					await fetch(`https://ntfy.sh/${ntfyEndpoint}`, {
						method: 'POST', // PUT works too
						body: `${body} ${receiptId}`,
						headers: {
							Title: m.spry_bald_guppy_cry(),
							Priority: 'urgent',
							Tags: 'fire'
						}
					});

					console.log(`Send read receipt to ${ntfyEndpoint} endpoint.`);
				}
			} catch (e) {
				// We catch errors since it is not critical for the recipient
				console.error(e);
			}
		}

		// We set the retrievedAt date instead of instantly deleting the entry since we rely on some of the date for file downloads.
		// A cron job is cleaning up the DB and files
		await db
			.update(secretSchema)
			.set({ retrievedAt: new Date() })
			.where(eq(secretSchema.secretIdHash, secretIdHash));

		return { form, meta, content };
	}
};
