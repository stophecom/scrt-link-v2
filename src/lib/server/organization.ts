import { eq } from 'drizzle-orm';

import { sha256Hash } from '$lib/client/web-crypto';
import { generateBase64Token } from '$lib/crypto';
import { InviteStatus, type MembershipRole } from '$lib/data/enums';
import { DAY } from '$lib/data/units';

import { db } from './db';
import { invite, membership, type Organization, organization, type User, user } from './db/schema';
import { sendOrganisationInvitationEmail } from './transactional-email';

type GetOrganizationById = {
	organizationId: string;
};
export const getOrganizationById = async ({ organizationId }: GetOrganizationById) => {
	const [result] = await db
		.select()
		.from(organization)
		.where(eq(organization.id, organizationId))
		.limit(1);
	return result;
};

export const getOrganizationsByUserId = async (userId: User['id']) =>
	await db
		.select({
			id: organization.id,
			name: organization.name,
			role: membership.role
		})
		.from(membership)
		.innerJoin(organization, eq(membership.organizationId, organization.id))
		.where(eq(membership.userId, userId));

export const getMembersByOrganizationId = async (organizationId: Organization['id']) =>
	await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			picture: user.picture,
			role: membership.role
		})
		.from(membership)
		.innerJoin(user, eq(membership.userId, user.id))
		.where(eq(membership.organizationId, organizationId));

export const getInvitesByOrganizationId = async (organizationId: Organization['id']) =>
	await db
		.select({
			id: invite.id,
			email: invite.email,
			expiresAt: invite.expiresAt,
			acceptedAt: invite.acceptedAt,
			status: invite.status,
			role: invite.membershipRole
		})
		.from(invite)
		.where(eq(invite.organizationId, organizationId));

type InviteUserToOrganization = {
	userId: string;
	email: string;
	membershipRole: MembershipRole;
	organizationId: string;
};
export const inviteUserToOrganization = async ({
	userId,
	email,
	membershipRole,
	organizationId
}: InviteUserToOrganization) => {
	const otpToken = generateBase64Token();
	const otpTokenHash = await sha256Hash(otpToken);

	const expiresAt = new Date(Date.now() + 7 * DAY);

	await db.insert(invite).values({
		email,
		organizationId,
		membershipRole,
		invitedByUserId: userId,
		token: otpTokenHash,
		expiresAt
	});

	const organization = await getOrganizationById({ organizationId });
	const name = organization.name;

	await sendOrganisationInvitationEmail(email, otpToken, name);
};

export type MembersAndInvitesByOrganization = {
	id: string;
	name: string | null;
	email: string;
	picture: string | null;
	role: MembershipRole | null;
	status: InviteStatus | null;
};

export const getMembersAndInvitesByOrganization = async (organizationId: Organization['id']) => {
	const existingMembers = await getMembersByOrganizationId(organizationId);

	const invitedMembers = await getInvitesByOrganizationId(organizationId);

	const mergedMap = new Map<string, MembersAndInvitesByOrganization>();

	// Add existing members first
	for (const member of existingMembers) {
		mergedMap.set(member.email, {
			id: member.id,
			name: member.name ?? null,
			email: member.email,
			picture: member.picture ?? null,
			role: member.role ?? null,
			status: InviteStatus.ACCEPTED
		});
	}

	// Add invited members if email not already present
	for (const invite of invitedMembers) {
		if (!mergedMap.has(invite.email)) {
			let status: InviteStatus = invite.status ?? InviteStatus.PENDING;
			if (invite.expiresAt < new Date()) {
				status = InviteStatus.EXPIRED;
			}

			mergedMap.set(invite.email, {
				id: invite.id,
				name: null,
				email: invite.email,
				picture: null,
				role: invite.role ?? null,
				status: status
			});
		}
	}

	return Array.from(mergedMap.values());
};
