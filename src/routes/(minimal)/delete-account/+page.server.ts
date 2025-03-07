import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user as userSchema } from '$lib/server/db/schema';
import { deleteAccountSchema } from '$lib/validators/formSchemas';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
	if (!event.locals.user) {
		return redirect(307, '/login');
	}

	return {
		user: event.locals.user,
		accountDeletionForm: await superValidate(zod(deleteAccountSchema()))
	};
}

export const actions: Actions = {
	deleteAccount: deleteAccount
};

async function deleteAccount(event: RequestEvent) {
	if (!event.locals.user) {
		return redirect(307, '/login');
	}

	if (!event.locals.session) {
		return fail(401);
	}

	const accountDeletionForm = await superValidate(event.request, zod(deleteAccountSchema()));

	if (!accountDeletionForm.valid) {
		return fail(400, { accountDeletionForm });
	}

	const { confirm } = accountDeletionForm.data;

	try {
		if (confirm) {
			await db.delete(userSchema).where(eq(userSchema.id, event.locals.user.id));
			await auth.invalidateSession(event.locals.session.id);
			auth.deleteSessionTokenCookie(event);
		}
	} catch (e) {
		console.error(e);
		error(500, 'Failed to delete account.');
	}

	return redirect(303, '/farewell');
}
