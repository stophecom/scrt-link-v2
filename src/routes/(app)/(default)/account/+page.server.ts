import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { MembershipRole, SecretType } from '$lib/data/enums';
import { DEFAULT_LOCALE, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import {
	addMemberToOrganization,
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
import { fetchSecrets } from '$lib/server/secrets';
import {
	getActiveApiKeys,
	getMembersByOrganization,
	getOrganizationsByUser
} from '$lib/server/user';
import { getWhiteLabelSiteByUserId } from '$lib/server/whiteLabelSite';
import {
	inviteOrganizationMemberFormSchema,
	organizationFormSchema,
	whiteLabelMetaSchema
} from '$lib/validators/formSchemas';

import { actions as secretActions } from '../+page.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const secrets = await fetchSecrets({ userId: user.id, host: url.host });

	const whiteLabel = await getWhiteLabelSiteByUserId(user.id);

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

	// We allow (and assume) only one organization with OWNER role.
	const userOrganization = userOrganizations.find((item) => item.role === MembershipRole.OWNER);

	let membersByOrganization: Awaited<ReturnType<typeof getMembersByOrganization>> = [];
	if (userOrganization) {
		membersByOrganization = await getMembersByOrganization(userOrganization.id);
	}
	const organizationFormValidator = async () => {
		return await superValidate(
			{ organizationId: userOrganization?.id, name: userOrganization?.name },
			zod(organizationFormSchema()),
			{
				errors: false
			}
		);
	};
	const inviteOrganizationMemberFormValidator = async () => {
		return await superValidate(zod(inviteOrganizationMemberFormSchema()), {
			errors: false
		});
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

	const apiKeys = await getActiveApiKeys(user.id);

	return {
		user: user,
		apiKeys: apiKeys,
		secrets: secrets,
		organizationIdOptions: getOrganizationIdOptions(),
		userOrganization: userOrganization
			? { ...userOrganization, members: membersByOrganization }
			: null,
		organizationForm: await organizationFormValidator(),
		inviteOrganizationMemberForm: await inviteOrganizationMemberFormValidator(),
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
	addMemberToOrganization: addMemberToOrganization,
	revokeAPIToken: revokeAPIToken,
	logout: logout
};
