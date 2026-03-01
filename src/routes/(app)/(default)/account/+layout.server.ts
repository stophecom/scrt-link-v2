import { DEFAULT_LOCALE, redirectLocalized } from '$lib/i18n';
import { getOrganizationsByUserId } from '$lib/server/organization';
import { getWhiteLabelSiteByUserId } from '$lib/server/whiteLabelSite';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const whiteLabel = await getWhiteLabelSiteByUserId(user.id);
	const userOrganizations = await getOrganizationsByUserId(user.id);

	// Allow organization regardless of role. Limits currently restrict to 1 organization.
	const userOrganization = userOrganizations[0];

	return {
		user: user,
		userOrganization: userOrganization,
		whiteLabelDomain: whiteLabel?.customDomain,
		whiteLabel: whiteLabel
	};
};
