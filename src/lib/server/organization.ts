import { sha256Hash } from '@scrt-link/core';
import { and, eq, or } from 'drizzle-orm';

import { generateBase64Token } from '$lib/crypto';
import { InviteStatus, MembershipRole, TierOptions } from '$lib/data/enums';
import { DAY } from '$lib/data/units';

import { db } from './db';
import {
	apiKey,
	invite,
	membership,
	type Organization,
	organization,
	type User,
	user
} from './db/schema';
import stripeInstance, { getActiveSubscription } from './stripe';
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

export const syncOrgSeatCount = async (organizationId: string) => {
	const [org] = await db
		.select()
		.from(organization)
		.where(eq(organization.id, organizationId))
		.limit(1);

	if (!org?.stripeCustomerId) return;

	const subscription = await getActiveSubscription(org.stripeCustomerId);
	if (!subscription) return;

	const members = await getMembersByOrganizationId(organizationId);
	const quantity = Math.max(members.length, 1);

	const seatItem = subscription.items.data.find((i) => !i.price.lookup_key?.includes('_base_'));
	if (!seatItem) return;

	try {
		await stripeInstance.subscriptions.update(subscription.id, {
			items: [{ id: seatItem.id, quantity }]
		});
	} catch (e) {
		console.error('[syncOrgSeatCount] Failed to update Stripe quantity:', e);
	}
};

export const getOrganizationsByUserId = async (userId: User['id']) =>
	await db
		.select({
			id: organization.id,
			name: organization.name,
			stripeCustomerId: organization.stripeCustomerId,
			role: membership.role
		})
		.from(membership)
		.innerJoin(organization, eq(membership.organizationId, organization.id))
		.where(eq(membership.userId, userId));

export const getMembersByOrganizationId = async (organizationId: Organization['id']) =>
	await db
		.select({
			userId: user.id,
			name: user.name,
			email: user.email,
			picture: user.picture,
			role: membership.role
		})
		.from(membership)
		.innerJoin(user, eq(membership.userId, user.id))
		.where(eq(membership.organizationId, organizationId));

export const isMemberOfOrganization = async (
	userId: string,
	organizationId: string
): Promise<boolean> => {
	const result = await db.query.membership.findFirst({
		where: and(eq(membership.userId, userId), eq(membership.organizationId, organizationId))
	});

	return !!result;
};

export const getActiveApiKeysByOrgId = async (organizationId: Organization['id']) =>
	await db
		.select()
		.from(apiKey)
		.where(and(eq(apiKey.organizationId, organizationId), eq(apiKey.revoked, false)));

export const isUserOrgOwnerOrAdmin = async (
	userId: string,
	organizationId: string
): Promise<boolean> => {
	const result = await db.query.membership.findFirst({
		where: and(
			eq(membership.userId, userId),
			eq(membership.organizationId, organizationId),
			or(eq(membership.role, MembershipRole.OWNER), eq(membership.role, MembershipRole.ADMIN))
		)
	});
	return !!result;
};
export const getInvitesByOrganizationId = async (organizationId: Organization['id']) =>
	await db
		.select({
			inviteId: invite.id,
			name: invite.name,
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
	name?: string;
	membershipRole: MembershipRole;
	organizationId: string;
};
export const inviteUserToOrganization = async ({
	userId,
	email,
	name,
	membershipRole,
	organizationId
}: InviteUserToOrganization) => {
	const otpToken = generateBase64Token();
	const otpTokenHash = await sha256Hash(otpToken);

	const expiresAt = new Date(Date.now() + 7 * DAY);

	await db.insert(invite).values({
		email,
		name,
		organizationId,
		membershipRole,
		invitedByUserId: userId,
		token: otpTokenHash,
		expiresAt
	});

	const organization = await getOrganizationById({ organizationId });
	const organizationName = organization.name;

	await sendOrganisationInvitationEmail(email, otpToken, organizationName);
};

export type MembersAndInvitesByOrganization = {
	userId?: string;
	inviteId?: string;
	name: string | null;
	email: string;
	picture: string | null;
	role: MembershipRole | null;
	status: InviteStatus | null;
};

const TIER_RANK: Record<TierOptions, number> = {
	[TierOptions.CONFIDENTIAL]: 0,
	[TierOptions.SECRET]: 1,
	[TierOptions.TOP_SECRET]: 2,
	[TierOptions.SECRET_SERVICE]: 3,
	[TierOptions.TOP_SECRET_SERVICE]: 4
};

const ORG_PLAN_TO_MEMBER_TIER: Partial<Record<TierOptions, TierOptions>> = {
	[TierOptions.SECRET_SERVICE]: TierOptions.SECRET,
	[TierOptions.TOP_SECRET_SERVICE]: TierOptions.TOP_SECRET
};

export const getEffectiveTierForUser = async (
	userId: string,
	userTier: TierOptions
): Promise<TierOptions> => {
	const orgs = await db
		.select({ subscriptionTier: organization.subscriptionTier, role: membership.role })
		.from(membership)
		.innerJoin(organization, eq(membership.organizationId, organization.id))
		.where(eq(membership.userId, userId));

	let effective = userTier;

	for (const org of orgs) {
		if (!org.subscriptionTier) continue;

		// Owners and admins get the org tier directly (SECRET_SERVICE includes whiteLabel: true).
		// Members get the conferred personal equivalent — enough for secret creation
		// but without org management features like white-label setup.
		const candidate =
			org.role === MembershipRole.OWNER || org.role === MembershipRole.ADMIN
				? org.subscriptionTier
				: ORG_PLAN_TO_MEMBER_TIER[org.subscriptionTier];

		if (candidate && TIER_RANK[candidate] > TIER_RANK[effective]) {
			effective = candidate;
		}
	}

	return effective;
};

export const getMembersAndInvitesByOrganization = async (organizationId: Organization['id']) => {
	const existingMembers = await getMembersByOrganizationId(organizationId);

	const invitedMembers = await getInvitesByOrganizationId(organizationId);

	const mergedMap = new Map<string, MembersAndInvitesByOrganization>();

	// Add existing members first
	for (const member of existingMembers) {
		mergedMap.set(member.email, {
			userId: member.userId,
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
				inviteId: invite.inviteId,
				name: invite.name ?? null,
				email: invite.email,
				picture: null,
				role: invite.role ?? null,
				status: status
			});
		}
	}

	return Array.from(mergedMap.values());
};
