import { error } from '@sveltejs/kit';

import { getUserPlanLimits } from '$lib/data/plans';
import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { createAPIToken, revokeAPIToken } from '$lib/server/form/actions';
import { apiKeyFormValidator } from '$lib/server/form/validators';
import { getActiveApiKeysByOrgId } from '$lib/server/organization';
import { getWhiteLabelSiteByOrgId } from '$lib/server/whiteLabelSite';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	const { org, isOrgOwner, isOrgAdmin } = await parent();
	if (!isOrgOwner && !isOrgAdmin)
		return error(403, 'Only org owners and admins can manage API keys.');

	const whiteLabel = await getWhiteLabelSiteByOrgId(org.id);

	return {
		user,
		apiKeys: await getActiveApiKeysByOrgId(org.id),
		apiKeyForm: await apiKeyFormValidator(org.id),
		// Organization keys are gated on the organization's own plan, not the member's.
		hasApiAccess: getUserPlanLimits(org.subscriptionTier).apiAccess,
		whiteLabelDomain: whiteLabel?.customDomain ?? null,
		pageTitle: m.super_funny_jackal_pause()
	};
};

export const actions: Actions = {
	createAPIToken,
	revokeAPIToken
};
