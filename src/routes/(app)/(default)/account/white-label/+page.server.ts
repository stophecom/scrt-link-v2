import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { SecretType } from '$lib/data/enums';
import { DEFAULT_LOCALE, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { saveWhiteLabelMeta } from '$lib/server/form/actions';
import { whiteLabelMetaSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const { whiteLabel, userOrganization } = await parent();

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
			zod4(whiteLabelMetaSchema())
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
		user,
		organizationIdOptions: getOrganizationIdOptions(),
		whiteLabelDomain: whiteLabel?.customDomain,
		whiteLabelForm: await whiteLabelFormValidator()
	};
};

export const actions: Actions = {
	saveWhiteLabelMeta: saveWhiteLabelMeta
};
