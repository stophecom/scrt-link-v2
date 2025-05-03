import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { SecretType } from '$lib/data/enums';
import { DEFAULT_LOCALE, redirectLocalized } from '$lib/i18n';
import { db } from '$lib/server/db';
import { whiteLabelSite } from '$lib/server/db/schema';
import {
	createAPIToken,
	logout,
	revokeAPIToken,
	saveSettings,
	saveTheme,
	saveUser,
	saveWhiteLabelMeta
} from '$lib/server/form/actions';
import {
	apiKeyFormValidator,
	settingsFormValidator,
	themeFormValidator,
	userFormValidator
} from '$lib/server/form/validators';
import { getActiveApiKeys } from '$lib/server/user';
import { whiteLabelMetaSchema } from '$lib/validators/formSchemas';

import { actions as secretActions } from '../+page.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/signup');
	}
	const user = event.locals.user;

	const apiKeys = await getActiveApiKeys(user.id);

	const whiteLabelFormValidator = async () => {
		const [whiteLabel] = await db
			.select()
			.from(whiteLabelSite)
			.where(eq(whiteLabelSite.userId, user.id));

		return await superValidate(
			{
				name: whiteLabel?.name || '',
				customDomain: whiteLabel?.customDomain || '',
				locale: whiteLabel?.locale || DEFAULT_LOCALE,
				enabledSecretTypes: whiteLabel?.enabledSecretTypes || [SecretType.TEXT]
			},
			zod(whiteLabelMetaSchema())
		);
	};

	return {
		user: user,
		apiKeys: apiKeys,
		themeForm: await themeFormValidator(user),
		settingsForm: await settingsFormValidator(user),
		userForm: await userFormValidator(user),
		apiKeyForm: await apiKeyFormValidator(),
		whiteLabelForm: await whiteLabelFormValidator()
	};
};

export const actions: Actions = {
	...secretActions,
	saveTheme: saveTheme,
	saveSettings: saveSettings,
	saveUser: saveUser,
	saveWhiteLabelMeta: saveWhiteLabelMeta,
	createAPIToken: createAPIToken,
	revokeAPIToken: revokeAPIToken,
	logout: logout
};
