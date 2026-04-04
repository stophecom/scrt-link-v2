import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { saveUser, setupRecoveryKey, verifyCurrentPassword } from '$lib/server/form/actions';
import { userFormValidator } from '$lib/server/form/validators';
import { getUserEncryptionKeyStore } from '$lib/server/user';
import { passwordFormSchema, recoverySetupFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const keyStore = user.encryptionEnabled ? await getUserEncryptionKeyStore(user.id) : null;

	return {
		user,
		userForm: await userFormValidator(user),
		pageTitle: m.super_flaky_wallaby_pick(),
		encryptionEnabled: user.encryptionEnabled ?? false,
		hasRecoveryKey: !!keyStore?.recoveryKeyHash,
		keyStore: keyStore
			? {
					pdkSalt: keyStore.pdkSalt,
					pdkIterations: keyStore.pdkIterations,
					encryptedMasterKey: keyStore.encryptedMasterKey
				}
			: null,
		recoveryPasswordForm: await superValidate(zod4(passwordFormSchema()), {
			id: 'recovery-password-form'
		}),
		recoveryForm: await superValidate(zod4(recoverySetupFormSchema()), {
			id: 'recovery-setup-form'
		})
	};
};

export const actions: Actions = {
	saveUser,
	verifyCurrentPassword,
	setupRecoveryKey
};
