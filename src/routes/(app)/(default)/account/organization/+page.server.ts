import { eq } from 'drizzle-orm';
import type { Stripe } from 'stripe';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { MembershipRole } from '$lib/data/enums';
import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { organization } from '$lib/server/db/schema';
import { getActiveSubscription } from '$lib/server/stripe';
import {
	addMemberToOrganization,
	createOrganization,
	editOrganization,
	manageOrganizationMember,
	removeOrganizationMember
} from '$lib/server/form/actions';
import { getMembersAndInvitesByOrganization } from '$lib/server/organization';
import {
	inviteOrganizationMemberFormSchema,
	manageOrganizationMemberFormSchema,
	organizationFormSchema
} from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	const { userOrganization } = await parent();

	let orgSubscription: Stripe.Subscription | null = null;
	let membersAndInvites = [];
	if (userOrganization) {
		membersAndInvites = await getMembersAndInvitesByOrganization(userOrganization.id);
		const [orgRow] = await db
			.select()
			.from(organization)
			.where(eq(organization.id, userOrganization.id))
			.limit(1);
		if (orgRow?.stripeCustomerId) {
			orgSubscription = await getActiveSubscription(orgRow.stripeCustomerId);
		}
	}

	const organizationForm = await superValidate(
		{ organizationId: userOrganization?.id, name: userOrganization?.name },
		zod4(organizationFormSchema()),
		{ errors: false }
	);

	const inviteOrganizationMemberForm = await superValidate(
		zod4(inviteOrganizationMemberFormSchema()),
		{ errors: false }
	);

	const manageOrganizationMemberForm = await superValidate(
		{ role: MembershipRole.MEMBER },
		zod4(manageOrganizationMemberFormSchema()),
		{ errors: false }
	);

	return {
		user,
		userOrganization: userOrganization
			? { ...userOrganization, members: membersAndInvites, role: userOrganization.role }
			: null,
		orgSubscription,
		organizationForm,
		inviteOrganizationMemberForm,
		manageOrganizationMemberForm,
		pageTitle: m.wild_inner_fox_honor()
	};
};

export const actions: Actions = {
	createOrganization,
	editOrganization,
	addMemberToOrganization,
	manageOrganizationMember,
	removeOrganizationMember
};
