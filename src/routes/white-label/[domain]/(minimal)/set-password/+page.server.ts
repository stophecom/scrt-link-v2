import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { RECOVERY_VERIFIED_COOKIE } from '$lib/server/cookies';
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

	const isRecoveryFlow = event.cookies.get(RECOVERY_VERIFIED_COOKIE) === user.id;

	if (user.encryptionEnabled) {
		const keyStore = await getUserEncryptionKeyStore(user.id);

		return {
			user,
			encryptionEnabled: true,
			isRecoveryFlow,
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
		isRecoveryFlow: false,
		keyStore: null,
		form: await superValidate(zod4(passwordFormSchema())),
		encryptionForm: null
	};
}

export const actions: Actions = {
	setPassword: setPassword
};
