import { redirectLocalized } from '$lib/i18n';
import {
	addMemberToOrganization,
	createOrganization,
	dismissWelcomeWizard,
	saveUser
} from '$lib/server/form/actions';

import type { Actions, PageServerLoad } from './$types';

// This route only hosts the welcome-wizard form actions. The wizard itself is an
// overlay rendered by the account layout; its forms post here via absolute
// `?/action` paths. A direct visit has nothing to show, so redirect to /account.
export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirectLocalized(307, '/signup');
	}
	return redirectLocalized(302, '/account');
};

export const actions: Actions = {
	saveUser,
	createOrganization,
	addMemberToOrganization,
	dismissWelcomeWizard
};
