import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { MembershipRole } from '$lib/data/enums';
import { redirectLocalized } from '$lib/i18n';
import {
	addMemberToOrganization,
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

	const { org } = await parent();

	const [
		membersAndInvites,
		organizationForm,
		inviteOrganizationMemberForm,
		manageOrganizationMemberForm
	] = await Promise.all([
		getMembersAndInvitesByOrganization(org.id),
		superValidate({ organizationId: org.id, name: org.name }, zod4(organizationFormSchema()), {
			errors: false
		}),
		superValidate(zod4(inviteOrganizationMemberFormSchema()), { errors: false }),
		superValidate({ role: MembershipRole.MEMBER }, zod4(manageOrganizationMemberFormSchema()), {
			errors: false
		})
	]);

	return {
		user,
		orgWithMembers: { ...org, members: membersAndInvites },
		organizationForm,
		inviteOrganizationMemberForm,
		manageOrganizationMemberForm,
		pageTitle: org.name
	};
};

export const actions: Actions = {
	editOrganization,
	addMemberToOrganization,
	manageOrganizationMember,
	removeOrganizationMember
};
