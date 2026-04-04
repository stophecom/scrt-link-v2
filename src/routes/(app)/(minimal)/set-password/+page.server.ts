import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { setPassword } from '$lib/server/form/actions';
import { getUserEncryptionKeyStore } from '$lib/server/user';
import {
	passwordChangeWithEncryptionFormSchema,
	passwordFormSchema
} from '$lib/validators/formSchemas';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
	if (!event.locals.user) {
		return redirectLocalized(307, '/login');
	}

	const user = event.locals.user;

	if (user.encryptionEnabled) {
		const keyStore = await getUserEncryptionKeyStore(user.id);

		return {
			user,
			encryptionEnabled: true,
			keyStore,
			form: await superValidate(zod4(passwordFormSchema())),
			encryptionForm: await superValidate(zod4(passwordChangeWithEncryptionFormSchema()), {
				id: 'encryption-password-form'
			})
		};
	}

	return {
		user,
		encryptionEnabled: false,
		keyStore: null,
		form: await superValidate(zod4(passwordFormSchema())),
		encryptionForm: null
	};
}

export const actions: Actions = {
	setPassword: setPassword
};
