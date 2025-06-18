import { desc, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { SecretType } from '$lib/data/enums';
import { DEFAULT_LOCALE, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { type Secret, secret, whiteLabelSite } from '$lib/server/db/schema';
import {
	createAPIToken,
	createOrganization,
	editOrganization,
	logout,
	revokeAPIToken,
	saveSettings,
	saveTheme,
	saveUser,
	saveWhiteLabelMeta
} from '$lib/server/form/actions';
import { postSecret } from '$lib/server/form/actions';
import {
	apiKeyFormValidator,
	secretFormValidator,
	settingsFormValidator,
	themeFormValidator,
	userFormValidator
} from '$lib/server/form/validators';
import {
	getActiveApiKeys,
	getMembersByOrganization,
	getOrganizationsByUser
} from '$lib/server/user';
import { organizationFormSchema, whiteLabelMetaSchema } from '$lib/validators/formSchemas';

import { actions as secretActions } from '../+page.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/signup');
	}
	const user = event.locals.user;

	const apiKeys = await getActiveApiKeys(user.id);

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

	const [whiteLabel] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.userId, user.id));

	const whiteLabelFormValidator = async () => {
		return await superValidate(
			{
				name: whiteLabel?.name || '',
				customDomain: whiteLabel?.customDomain || '',
				organizationId: whiteLabel?.organizationId || '',
				isPrivate: whiteLabel?.private || false,
				locale: whiteLabel?.locale || DEFAULT_LOCALE,
				enabledSecretTypes: whiteLabel?.enabledSecretTypes || [SecretType.TEXT, SecretType.FILE]
			},
			zod(whiteLabelMetaSchema())
		);
	};

	const userOrganizations = await getOrganizationsByUser(user.id);

	let userOrganization: Awaited<ReturnType<typeof getOrganizationsByUser>>[0] | null = null;
	let membersByOrganization: Awaited<ReturnType<typeof getMembersByOrganization>> = [];

	if (userOrganizations.length) {
		userOrganization = userOrganizations[0]; // We allow (and assume) only one organization

		membersByOrganization = await getMembersByOrganization(userOrganization.id);
	}
	const organizationFormValidator = async () => {
		return await superValidate(
			{ id: userOrganization?.id, name: userOrganization?.name },
			zod(organizationFormSchema()),
			{
				errors: false
			}
		);
	};

	const getOrganizationIdOptions = () => [
		{
			value: '',
			label: m.fuzzy_cool_ape_blend()
		},
		...(userOrganization
			? [
					{
						value: userOrganization.id,
						label: m.elegant_whole_swallow_edit({ organization: userOrganization.name })
					}
				]
			: [])
	];

	return {
		user: user,
		apiKeys: apiKeys,
		secrets: secrets,
		organizationIdOptions: getOrganizationIdOptions(),
		userOrganization: userOrganization
			? { ...userOrganization, members: membersByOrganization }
			: null,
		organizationForm: await organizationFormValidator(),
		whiteLabelDomain: whiteLabel?.customDomain,
		secretForm: await secretFormValidator(),
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
	postSecret: postSecret,
	saveWhiteLabelMeta: saveWhiteLabelMeta,
	createAPIToken: createAPIToken,
	createOrganization: createOrganization,
	editOrganization: editOrganization,
	revokeAPIToken: revokeAPIToken,
	logout: logout
};
