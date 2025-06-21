import { eq } from 'drizzle-orm';

import { db } from './db';
import { organization } from './db/schema';

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
