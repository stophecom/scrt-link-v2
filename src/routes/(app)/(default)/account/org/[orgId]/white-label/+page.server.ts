import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { SecretType } from '$lib/data/enums';
import { DEFAULT_LOCALE, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { saveWhiteLabelDomain, saveWhiteLabelMeta } from '$lib/server/form/actions';
import { getWhiteLabelSiteByOrgId, getWhiteLabelSiteByUserId } from '$lib/server/whiteLabelSite';
import { whiteLabelDomainSchema, whiteLabelMetaSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	const { org, isOrgOwner, isOrgAdmin } = await parent();
	if (!isOrgOwner && !isOrgAdmin)
		return error(403, 'Only org owners and admins can manage the white-label site.');

	// Prefer the site linked to this org; fall back to the creator's personal site
	// (for orgs whose site was created before the organizationId FK was in use).
	const whiteLabel =
		(await getWhiteLabelSiteByOrgId(org.id)) ?? (await getWhiteLabelSiteByUserId(user.id));

	const organizationIdOptions = [
		{ value: '', label: m.misty_real_florian_startle() },
		{ value: org.id, label: org.name }
	];

	const whiteLabelDomainForm = await superValidate(
		{ name: whiteLabel?.name || '', customDomain: whiteLabel?.customDomain || '', organizationId: org.id },
		zod4(whiteLabelDomainSchema())
	);

	const whiteLabelForm = await superValidate(
		{
			organizationId: whiteLabel?.organizationId || org.id,
			isPrivate: whiteLabel?.private || false,
			locale: whiteLabel?.locale || DEFAULT_LOCALE,
			enabledSecretTypes: whiteLabel?.enabledSecretTypes || [SecretType.TEXT, SecretType.FILE],
			enableSecretRequests: whiteLabel?.enableSecretRequests || false
		},
		zod4(whiteLabelMetaSchema())
	);

	return {
		user,
		whiteLabelDomain: whiteLabel?.customDomain,
		whiteLabel,
		organizationIdOptions,
		whiteLabelDomainForm,
		whiteLabelForm,
		pageTitle: m.bold_slim_ram_roam()
	};
};

export const actions: Actions = {
	saveWhiteLabelDomain,
	saveWhiteLabelMeta
};
