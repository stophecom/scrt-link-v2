import { redirectLocalized } from '$lib/i18n';
import { getOrganizationsByUserId } from '$lib/server/organization';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const userOrganizations = await getOrganizationsByUserId(user.id);
	const userOrganization = userOrganizations[0];

	return {
		user,
		userOrganization,
		wideLayout: true
	};
};
