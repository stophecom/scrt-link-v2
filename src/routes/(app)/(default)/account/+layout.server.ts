import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { m } from '$lib/paraglide/messages.js';
import { getOrganizationsByUserId } from '$lib/server/organization';
import { getWhiteLabelSiteByOrgId, getWhiteLabelSiteByUserId } from '$lib/server/whiteLabelSite';
import {
	inviteOrganizationMemberFormSchema,
	organizationFormSchema,
	userFormSchema
} from '$lib/validators/formSchemas';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user!;

	const userOrganizations = await getOrganizationsByUserId(user.id);

	// Allow organization regardless of role. Limits currently restrict to 1 organization.
	const userOrganization = userOrganizations[0];

	const whiteLabel = userOrganization
		? await getWhiteLabelSiteByOrgId(userOrganization.id)
		: await getWhiteLabelSiteByUserId(user.id);

	// One-time welcome wizard for freshly created accounts. The flag is set at account
	// creation and consumed the first time this overlay renders (see welcome-wizard.svelte).
	const showWelcomeWizard = user.preferences?.showWelcomeWizard === true;
	const welcomeForms = showWelcomeWizard
		? {
				// Prefill the name if we already have one (e.g. from Google sign-up).
				// `errors: false` so an empty/missing name doesn't show a validation error
				// before the user has typed anything.
				welcomeUserForm: await superValidate({ name: user.name ?? '' }, zod4(userFormSchema()), {
					id: 'welcome-user',
					errors: false
				}),
				welcomeOrganizationForm: await superValidate(zod4(organizationFormSchema()), {
					id: 'welcome-organization'
				}),
				welcomeInviteForm: await superValidate(zod4(inviteOrganizationMemberFormSchema()), {
					id: 'welcome-invite'
				})
			}
		: {};

	return {
		user: user,
		userOrganization: userOrganization,
		userOrganizations,
		whiteLabelDomain: whiteLabel?.customDomain,
		whiteLabel: whiteLabel,
		isPersistentHeader: true,
		headerBreadcrumb: m.novel_proud_anaconda_zoom(),
		showWelcomeWizard,
		...welcomeForms
	};
};
