import { desc, eq } from 'drizzle-orm';

import { redirectLocalized } from '$lib/i18n';
import { db } from '$lib/server/db';
import { type Secret, secret } from '$lib/server/db/schema';
import { logout, saveSettings, saveTheme, saveUser } from '$lib/server/form/actions';
import { postSecret } from '$lib/server/form/actions';
import {
	secretFormValidator,
	settingsFormValidator,
	themeFormValidator,
	userFormValidator
} from '$lib/server/form/validators';

import { actions as secretActions } from '../+page.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/signup');
	}
	const user = event.locals.user;

	let secrets: ({ destroyed: boolean } & Pick<
		Secret,
		'receiptId' | 'expiresAt' | 'retrievedAt' | 'publicNote'
	>)[] = [];
	const secretList = await db
		.select()
		.from(secret)
		.where(eq(secret.userId, user.id))
		.orderBy(desc(secret.expiresAt));

	if (secretList.length) {
		secrets = secretList.map(({ receiptId, expiresAt, retrievedAt, publicNote, meta }) => ({
			receiptId,
			expiresAt,
			retrievedAt,
			publicNote,
			destroyed: !meta
		}));
	}

	return {
		user: user,
		secrets: secrets,
		secretForm: await secretFormValidator(),
		themeForm: await themeFormValidator(user),
		settingsForm: await settingsFormValidator(user),
		userForm: await userFormValidator(user)
	};
};

export const actions: Actions = {
	...secretActions,
	saveTheme: saveTheme,
	saveSettings: saveSettings,
	saveUser: saveUser,
	postSecret: postSecret,
	logout: logout
};
