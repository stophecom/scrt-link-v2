import { eq } from 'drizzle-orm';

import { db } from './db';
import { whiteLabelSite } from './db/schema';

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
