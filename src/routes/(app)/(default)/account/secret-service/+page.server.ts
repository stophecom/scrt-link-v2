import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { MembershipRole, SecretType } from '$lib/data/enums';
import { DEFAULT_LOCALE, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import {
	addMemberToOrganization,
	createOrganization,
	editOrganization,
	manageOrganizationMember,
	removeOrganizationMember,
	saveWhiteLabelMeta
} from '$lib/server/form/actions';
import {
	getMembersAndInvitesByOrganization,
	type MembersAndInvitesByOrganization
} from '$lib/server/organization';
import {
	inviteOrganizationMemberFormSchema,
	manageOrganizationMemberFormSchema,
	organizationFormSchema,
	whiteLabelMetaSchema
} from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const { whiteLabel, userOrganization } = await parent();

	// White label form
	const whiteLabelFormValidator = async () => {
		return await superValidate(
			{
				name: whiteLabel?.name || '',
				customDomain: whiteLabel?.customDomain || '',
				organizationId: whiteLabel?.organizationId || '',
				isPrivate: whiteLabel?.private || false,
				locale: whiteLabel?.locale || DEFAULT_LOCALE,
				enabledSecretTypes: whiteLabel?.enabledSecretTypes || [SecretType.TEXT, SecretType.FILE]
			},
			zod4(whiteLabelMetaSchema())
		);
	};

	const getOrganizationIdOptions = () => [
		{
			value: '',
			label: m.misty_real_florian_startle()
		},
		...(userOrganization
			? [
					{
						value: userOrganization.id,
						label: userOrganization.name
					}
				]
			: [])
	];

	// Organization data
	let membersAndInvitesByOrganization: MembersAndInvitesByOrganization[] = [];

	if (userOrganization) {
		membersAndInvitesByOrganization = await getMembersAndInvitesByOrganization(
			userOrganization.id
		);
	}

	const organizationFormValidator = async () => {
		return await superValidate(
			{ organizationId: userOrganization?.id, name: userOrganization?.name },
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

	return {
		user,
		organizationIdOptions: getOrganizationIdOptions(),
		whiteLabelDomain: whiteLabel?.customDomain,
		whiteLabelForm: await whiteLabelFormValidator(),
		userOrganization: userOrganization
			? {
					...userOrganization,
					members: membersAndInvitesByOrganization,
					role: userOrganization.role
				}
			: null,
		organizationForm: await organizationFormValidator(),
		inviteOrganizationMemberForm: await inviteOrganizationMemberFormValidator(),
		manageOrganizationMemberForm: await manageOrganizationMemberFormValidator(),
		pageTitle: m.any_jumpy_fox_wave()
	};
};

export const actions: Actions = {
	saveWhiteLabelMeta: saveWhiteLabelMeta,
	createOrganization: createOrganization,
	editOrganization: editOrganization,
	addMemberToOrganization: addMemberToOrganization,
	manageOrganizationMember: manageOrganizationMember,
	removeOrganizationMember: removeOrganizationMember
};
