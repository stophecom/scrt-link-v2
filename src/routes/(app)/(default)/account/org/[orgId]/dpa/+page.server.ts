import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { redirectLocalized } from '$lib/i18n';
import { db } from '$lib/server/db';
import { membership, organization } from '$lib/server/db/schema';

import type { PageServerLoad } from './$types';

// This page resets its layout to (default), so it no longer inherits the org
// layout's load — auth, the membership guard, and the org lookup are done here.
export const load: PageServerLoad = async ({ locals, params }) => {
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

	const [org] = await db
		.select({ name: organization.name })
		.from(organization)
		.where(eq(organization.id, orgId))
		.limit(1);

	if (!org) return error(404, 'Organization not found.');

	return {
		defaults: {
			companyName: org.name,
			signerEmail: user.email
		}
	};
};
