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
	if (!user) return redirectLocalized(307, '/signup');

	const { whiteLabel, whiteLabelDomain, userOrganization } = await parent();

	const organizationIdOptions = [
		{ value: '', label: m.misty_real_florian_startle() },
		...(userOrganization ? [{ value: userOrganization.id, label: userOrganization.name }] : [])
	];

	const whiteLabelForm = await superValidate(
		{
			name: whiteLabel?.name || '',
			customDomain: whiteLabel?.customDomain || '',
			organizationId: whiteLabel?.organizationId || '',
			isPrivate: whiteLabel?.private || false,
			locale: whiteLabel?.locale || DEFAULT_LOCALE,
			enabledSecretTypes: whiteLabel?.enabledSecretTypes || [SecretType.TEXT, SecretType.FILE],
			enableSecretRequests: whiteLabel?.enableSecretRequests || false
		},
		zod4(whiteLabelMetaSchema())
	);

	return {
		user,
		whiteLabelDomain,
		whiteLabel,
		organizationIdOptions,
		whiteLabelForm,
		pageTitle: m.bold_slim_ram_roam()
	};
};

export const actions: Actions = {
	saveWhiteLabelMeta
};
