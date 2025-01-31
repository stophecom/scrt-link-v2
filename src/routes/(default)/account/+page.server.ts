import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { userSettings } from '$lib/server/db/schema';
import { settingsFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(307, '/signup');
	}
	const user = event.locals.user;

	const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id));

	return {
		user: user,
		form: await superValidate(
			{
				readReceiptOption: settings.readReceipt || 'none',
				email: settings.email || user.email,
				ntfyEndpoint: settings.ntfyEndpoint || ''
			},
			zod(settingsFormSchema())
		)
	};
};

export const actions: Actions = {
	saveSettings: async (event) => {
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
			title: `Settings saved`
		});
	},
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(303, '/');
	}
};
