import { MembershipRole } from '$lib/data/enums';
import { redirectLocalized } from '$lib/i18n';

import type { PageServerLoad } from './$types';

// White-label management has moved to /account/org/[orgId]/white-label.
// Redirect owners to their first org's white-label page; everyone else to /pricing.
export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	const { userOrganizations } = await parent();

	const ownedOrg = userOrganizations.find((o) => o.role === MembershipRole.OWNER);
	if (ownedOrg) {
		return redirectLocalized(302, `/account/org/${ownedOrg.id}/white-label`);
	}

	return redirectLocalized(302, '/pricing');
};
