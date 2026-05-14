import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { createOrganization } from '$lib/server/form/actions';
import { organizationFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

// When the user already belongs to organizations, redirect to the first one.
// When they have none, show the creation form (the only action here).
export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	const { userOrganizations } = await parent();

	if (userOrganizations.length > 0) {
		return redirectLocalized(302, `/account/org/${userOrganizations[0].id}`);
	}

	const organizationForm = await superValidate(zod4(organizationFormSchema()), { errors: false });

	return {
		organizationForm,
		pageTitle: m.wild_inner_fox_honor()
	};
};

export const actions: Actions = { createOrganization };
