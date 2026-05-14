import { and, eq, or } from 'drizzle-orm';

import { isOriginalHostname } from '$lib/app-routing';
import { MembershipRole, TierOptions } from '$lib/data/enums';

import { db } from './db';
import { membership, organization, user, whiteLabelSite } from './db/schema';
import { getMembersByOrganizationId } from './organization';

export const getWhiteLabelSiteByHost = async (host: string) => {
	const [whiteLabelResult] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.customDomain, host));

	return whiteLabelResult;
};

export const getWhiteLabelSiteByUserId = async (userId: string) => {
	const [whiteLabelResult] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.userId, userId));

	return whiteLabelResult;
};

export const getWhiteLabelSiteByOrgId = async (organizationId: string) => {
	const [result] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.organizationId, organizationId));
	return result ?? null;
};

// Returns the white-label site a user can manage: their own, or any site linked to
// an org they own or admin (when they're not the original creator).
export const getWhiteLabelSiteForUser = async (userId: string) => {
	const direct = await getWhiteLabelSiteByUserId(userId);
	if (direct) return direct;

	const [row] = await db
		.select({ site: whiteLabelSite })
		.from(whiteLabelSite)
		.innerJoin(organization, eq(whiteLabelSite.organizationId, organization.id))
		.innerJoin(
			membership,
			and(
				eq(membership.organizationId, organization.id),
				eq(membership.userId, userId),
				or(eq(membership.role, MembershipRole.OWNER), eq(membership.role, MembershipRole.ADMIN))
			)
		)
		.limit(1);

	return row?.site ?? null;
};

export const getWhiteLabelSiteById = async (id: string) => {
	const [whiteLabelResult] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.id, id));

	return whiteLabelResult;
};

export const getWhiteLabelSiteOwnerTier = async (site: {
	userId: string | null;
	organizationId: string | null;
}): Promise<TierOptions> => {
	if (site.userId) {
		const [owner] = await db
			.select({ subscriptionTier: user.subscriptionTier })
			.from(user)
			.where(eq(user.id, site.userId));
		return owner?.subscriptionTier ?? TierOptions.CONFIDENTIAL;
	}

	if (site.organizationId) {
		const [org] = await db
			.select({ subscriptionTier: organization.subscriptionTier })
			.from(organization)
			.where(eq(organization.id, site.organizationId));
		return org?.subscriptionTier ?? TierOptions.CONFIDENTIAL;
	}

	return TierOptions.CONFIDENTIAL;
};

export const checkIsUserAllowedOnWhiteLabelSite = async (host: string, userId: string) => {
	// Restrict login to white-label

	if (host && !isOriginalHostname(host)) {
		const whiteLabelSiteResult = await getWhiteLabelSiteByHost(host);

		// Site is restricted to either user (personal owner) or members of the assigned organization
		const isOwner =
			whiteLabelSiteResult.userId !== null && userId === whiteLabelSiteResult.userId;
		const orgId = whiteLabelSiteResult.organizationId;

		if (!isOwner) {
			if (!orgId) {
				throw Error(`Access is restricted. No organization assigned to this site.`);
			}
			if (whiteLabelSiteResult.organizationId) {
				const members = await getMembersByOrganizationId(whiteLabelSiteResult.organizationId);
				const isMember = members.some((item) => item.userId === userId);

				if (!isMember) {
					throw Error(
						`Access is restricted. Only owners or assigned organization members are allowed to login to ${host}`
					);
				}
			}
		}
	}
};
