import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { MembershipRole } from '$lib/data/enums';
import { redirectLocalized } from '$lib/i18n';
import { db } from '$lib/server/db';
import { membership, organization } from '$lib/server/db/schema';
import { getActiveSubscription } from '$lib/server/stripe';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	const orgId = params.orgId;

	const [memberRow] = await db
		.select({ role: membership.role })
		.from(membership)
		.where(and(eq(membership.userId, user.id), eq(membership.organizationId, orgId)));

	if (!memberRow) {
		return error(403, 'You are not a member of this organization.');
	}

	const [org] = await db.select().from(organization).where(eq(organization.id, orgId)).limit(1);

	if (!org) return error(404, 'Organization not found.');

	const orgSubscription = org.stripeCustomerId
		? await getActiveSubscription(org.stripeCustomerId)
		: null;

	return {
		org: { ...org, role: memberRow.role },
		orgSubscription,
		isOrgOwner: memberRow.role === MembershipRole.OWNER,
		isOrgAdmin: memberRow.role === MembershipRole.ADMIN
	};
};
