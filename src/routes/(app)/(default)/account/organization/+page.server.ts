import { MembershipRole } from '$lib/data/enums';
import { redirectLocalized } from '$lib/i18n';
import { getActiveSubscription } from '$lib/server/stripe';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	const { userOrganizations } = await parent();

	const ownedOrg = userOrganizations.find((org) => org.role === MembershipRole.OWNER);

	if (ownedOrg) {
		const subscription = ownedOrg.stripeCustomerId
			? await getActiveSubscription(ownedOrg.stripeCustomerId)
			: null;

		return subscription
			? redirectLocalized(302, `/account/org/${ownedOrg.id}`)
			: redirectLocalized(302, '/pricing?tab=business');
	}

	if (userOrganizations.length > 0) {
		return redirectLocalized(302, `/account/org/${userOrganizations[0].id}`);
	}

	return redirectLocalized(302, '/account/org/create');
};
