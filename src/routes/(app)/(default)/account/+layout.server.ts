import { m } from '$lib/paraglide/messages.js';
import { getOrganizationsByUserId } from '$lib/server/organization';
import { getWhiteLabelSiteByOrgId, getWhiteLabelSiteByUserId } from '$lib/server/whiteLabelSite';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user!;

	const userOrganizations = await getOrganizationsByUserId(user.id);

	// Allow organization regardless of role. Limits currently restrict to 1 organization.
	const userOrganization = userOrganizations[0];

	const whiteLabel = userOrganization
		? await getWhiteLabelSiteByOrgId(userOrganization.id)
		: await getWhiteLabelSiteByUserId(user.id);

	return {
		user: user,
		userOrganization: userOrganization,
		userOrganizations,
		whiteLabelDomain: whiteLabel?.customDomain,
		whiteLabel: whiteLabel,
		isPersistentHeader: true,
		headerBreadcrumb: m.novel_proud_anaconda_zoom()
	};
};
