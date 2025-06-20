import { eq } from 'drizzle-orm';

import { isOriginalHost } from '$lib/app-routing';

import { db } from './db';
import { whiteLabelSite } from './db/schema';
import { getMembersByOrganization } from './user';

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

export const getWhiteLabelSiteById = async (id: string) => {
	const [whiteLabelResult] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.id, id));

	return whiteLabelResult;
};

export const checkIsUserAllowedOnWhiteLabelSite = async (host: string, userId: string) => {
	// Restrict login to white-label

	if (host && !isOriginalHost(host)) {
		const whiteLabelSiteResult = await getWhiteLabelSiteByHost(host);

		// Site is restricted to either user (owner) or members of the assigned organization
		const isOwner = userId === whiteLabelSiteResult.userId;
		const orgId = whiteLabelSiteResult.organizationId;

		if (!isOwner) {
			if (!orgId) {
				throw Error(`Access is restricted. No organization assigned to this site.`);
			}
			if (whiteLabelSiteResult.organizationId) {
				const members = await getMembersByOrganization(whiteLabelSiteResult.organizationId);
				const isMember = members.some((item) => item.id === userId);

				if (!isMember) {
					throw Error(
						`Access is restricted. Only owners or assigned organization members are allowed to login to ${host}`
					);
				}
			}
		}
	}
};
