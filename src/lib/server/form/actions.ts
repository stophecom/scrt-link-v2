import { type Action, error, fail, redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { generateRandomUrlSafeString, scryptHash } from '$lib/crypto';
import { getExpiresInOptions } from '$lib/data/secretSettings';
import * as m from '$lib/paraglide/messages.js';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { secret, stats, user as userSchema, userSettings } from '$lib/server/db/schema';
import { secretFormSchema, settingsFormSchema, themeFormSchema } from '$lib/validators/formSchemas';

export const postSecret: Action = async (event) => {
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
};

export const saveTheme: Action = async (event) => {
	const form = await superValidate(event.request, zod(themeFormSchema()));
	if (!form.valid) {
		return fail(400, { form });
	}

	const user = event.locals.user;

	if (!user) {
		return redirect(307, '/signup');
	}

	const { themeOption } = form.data;

	await db
		.update(userSchema)
		.set({
			preferences: { themeColor: themeOption }
		})

		.where(eq(userSchema.id, user.id));

	return { form };
};

export const saveSettings: Action = async (event) => {
	const form = await superValidate(event.request, zod(settingsFormSchema()));

	const user = event.locals.user;

	const { email, ntfyEndpoint, readReceiptOption } = form.data;

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!user) {
		return redirect(307, '/signup');
	}

	await db
		.update(userSettings)
		.set({
			email,
			ntfyEndpoint,
			readReceipt: readReceiptOption
		})
		.where(eq(userSettings.userId, user.id));

	return message(form, {
		status: 'success',
		title: m.many_seemly_gorilla_jolt()
	});
};

export const logout: Action = async (event) => {
	if (!event.locals.session) {
		return fail(401);
	}
	await auth.invalidateSession(event.locals.session.id);
	auth.deleteSessionTokenCookie(event);

	return redirect(303, '/');
};
