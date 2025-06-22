import { eq } from 'drizzle-orm';

import { sha256Hash } from '$lib/client/web-crypto';
import { generateBase64Token } from '$lib/crypto';
import type { MembershipRole } from '$lib/data/enums';
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
