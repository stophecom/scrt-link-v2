import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { db } from '$lib/server/db';
import { user as userSchema } from '$lib/server/db/schema';
import { themeFormSchema } from '$lib/validators/formSchemas';

import { ThemeOptions } from '../../../../lib/data/enums';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(307, '/signup');
	}
	const user = event.locals.user;

	return {
		themeForm: await superValidate(
			{
				themeOption: user.preferences?.themeColor || ThemeOptions.PINK
			},
			zod(themeFormSchema())
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

		return { form };
	}
};
