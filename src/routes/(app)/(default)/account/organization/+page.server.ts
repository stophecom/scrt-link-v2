import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { MembershipRole } from '$lib/data/enums';
import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import {
	addMemberToOrganization,
	createOrganization,
	editOrganization,
	manageOrganizationMember,
	removeOrganizationMember
} from '$lib/server/form/actions';
import {
	getMembersAndInvitesByOrganization,
	type MembersAndInvitesByOrganization
} from '$lib/server/organization';
import {
	inviteOrganizationMemberFormSchema,
	manageOrganizationMemberFormSchema,
	organizationFormSchema
} from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	// parent layout provides userOrganization
	const { userOrganization: baseUserOrganization } = await parent();

	let membersAndInvitesByOrganization: MembersAndInvitesByOrganization[] = [];

	if (baseUserOrganization) {
		membersAndInvitesByOrganization = await getMembersAndInvitesByOrganization(
			baseUserOrganization.id
		);
	}

	const organizationFormValidator = async () => {
		return await superValidate(
			{ organizationId: baseUserOrganization?.id, name: baseUserOrganization?.name },
			zod4(organizationFormSchema()),
			{
				errors: false
			}
		);
	};

	const inviteOrganizationMemberFormValidator = async () => {
		return await superValidate(zod4(inviteOrganizationMemberFormSchema()), {
			errors: false
		});
	};

	const manageOrganizationMemberFormValidator = async () => {
		return await superValidate(
			{ role: MembershipRole.MEMBER },
			zod4(manageOrganizationMemberFormSchema()),
			{
				errors: false
			}
		);
	};

	const getOrganizationIdOptions = () => [
		{
			value: '',
			label: m.fuzzy_cool_ape_blend()
		},
		...(baseUserOrganization
			? [
					{
						value: baseUserOrganization.id,
						label: m.elegant_whole_swallow_edit({ organization: baseUserOrganization.name })
					}
				]
			: [])
	];

	return {
		organizationIdOptions: getOrganizationIdOptions(),
		userOrganization: baseUserOrganization
			? {
					...baseUserOrganization,
					members: membersAndInvitesByOrganization,
					role: baseUserOrganization.role
				}
			: null,
		organizationForm: await organizationFormValidator(),
		inviteOrganizationMemberForm: await inviteOrganizationMemberFormValidator(),
		manageOrganizationMemberForm: await manageOrganizationMemberFormValidator()
	};
};

export const actions: Actions = {
	createOrganization: createOrganization,
	editOrganization: editOrganization,
	addMemberToOrganization: addMemberToOrganization,
	manageOrganizationMember: manageOrganizationMember,
	removeOrganizationMember: removeOrganizationMember
};
