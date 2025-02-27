import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import * as m from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { user as userSchema, userSettings } from '$lib/server/db/schema';
import { settingsFormSchema, themeFormSchema } from '$lib/validators/formSchemas';

import { ReadReceiptOptions, ThemeOptions } from '../../../../lib/data/schemaEnums';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(307, '/signup');
	}
	const user = event.locals.user;

	const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id));

	return {
		user: user,

		themeForm: await superValidate(
			{
				themeOption: user.preferences?.themeColor || ThemeOptions.PINK
			},
			zod(themeFormSchema())
		),

		settingsForm: await superValidate(
			{
				readReceiptOption: settings.readReceipt || ReadReceiptOptions.NONE,
				email: settings.email || user.email,
				ntfyEndpoint: settings.ntfyEndpoint || ''
			},
			zod(settingsFormSchema())
		)
	};
};

export const actions: Actions = {
	saveTheme: async (event) => {
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

		return message(form, {
			status: 'success',
			title: m.many_seemly_gorilla_jolt()
		});
	},
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
			title: m.many_seemly_gorilla_jolt()
		});
	}
};
