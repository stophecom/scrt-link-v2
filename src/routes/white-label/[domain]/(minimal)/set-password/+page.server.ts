import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { setPassword } from '$lib/server/form/actions';
import { passwordFormSchema } from '$lib/validators/formSchemas';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
	if (!event.locals.user) {
		return redirectLocalized(307, '/login');
	}

	return {
		user: event.locals.user,
		form: await superValidate(zod(passwordFormSchema()))
	};
}

export const actions: Actions = {
	setPassword: setPassword
};
