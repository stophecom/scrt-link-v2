import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { setupEncryptionKeys, verifyCurrentPassword } from '$lib/server/form/actions';
import { getUserEncryptionKeyStore } from '$lib/server/user';
import { passwordFormSchema } from '$lib/validators/formSchemas';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
	const user = event.locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const keyStore = user.encryptionEnabled ? await getUserEncryptionKeyStore(user.id) : null;

	return {
		user,
		encryptionEnabled: user.encryptionEnabled ?? false,
		keyStore,
		passwordForm: await superValidate(zod4(passwordFormSchema()), { id: 'password-form' })
	};
}

export const actions: Actions = {
	verifyCurrentPassword,
	setupEncryptionKeys
};
