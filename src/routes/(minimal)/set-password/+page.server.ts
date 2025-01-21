import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { scryptHash } from '$lib/crypto';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { passwordFormSchema } from '$lib/validators/formSchemas';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
	if (!event.locals.user) {
		return redirect(307, '/login');
	}

	return {
		user: event.locals.user,
		form: await superValidate(zod(passwordFormSchema()))
	};
}

export const actions: Actions = {
	setPassword: setPassword
};

async function setPassword(event: RequestEvent) {
	if (!event.locals.user) {
		return redirect(307, '/login');
	}

	const passwordForm = await superValidate(event.request, zod(passwordFormSchema()));

	const { password } = passwordForm.data;

	try {
		// Update user
		const hashedPassword = await scryptHash(password);

		await db
			.update(user)
			.set({ passwordHash: hashedPassword })
			.where(eq(user.id, event.locals.user.id));
	} catch (e) {
		console.error(e);
		error(500, 'Failed to set password.');
	}

	return redirect(303, '/account');
}
