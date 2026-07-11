import { eq } from 'drizzle-orm';

import { isOriginalHostname } from '$lib/app-routing';
import { TierOptions } from '$lib/data/enums';
import { getLocale } from '$lib/paraglide/runtime';
import type { LocalizedWhiteLabelMessage } from '$lib/types';

import { db } from './db';
import { organization, user, whiteLabelSite } from './db/schema';
import { getMembersByOrganizationId } from './organization';

// Resolves the editable title/lead for a white-label page section (the secret
// request `/r` flow or the secret reception `/s` reveal flow) from the site's
// stored messages, in the active locale. Returns empty strings when unset so
// callers can fall back to the default i18n copy.
export const getWhiteLabelPageTexts = (
	site: { messages?: unknown } | null | undefined,
	section: 'request' | 'reception'
): { title: string; lead: string } => {
	const locale = getLocale();
	const messages = site?.messages as LocalizedWhiteLabelMessage | undefined;
	const sectionMessages = messages?.[locale]?.[section];

	return {
		title: sectionMessages?.title || '',
		lead: sectionMessages?.lead || ''
	};
};

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
		const isOwner = whiteLabelSiteResult.userId !== null && userId === whiteLabelSiteResult.userId;
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
