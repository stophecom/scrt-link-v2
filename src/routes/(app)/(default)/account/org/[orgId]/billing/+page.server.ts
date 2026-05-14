import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { getBaseUrl } from '$lib/constants';
import { MembershipRole } from '$lib/data/enums';
import { getAbsoluteLocalizedUrl, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { membership, user } from '$lib/server/db/schema';
import { updateOrganizationBillingOwner } from '$lib/server/form/actions';
import { getOrgInvoices, getStripePortalUrl, getSubscriptionPlanName } from '$lib/server/stripe';
import { updateBillingOwnerSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const user_ = locals.user;
	if (!user_) return redirectLocalized(307, '/signup');

	const { org, orgSubscription, isOrgOwner, isOrgAdmin } = await parent();

	// Billing page is visible to org owners, admins, and the designated billing contact.
	const isBillingOwner = org.billingOwnerId === user_.id;
	if (!isOrgOwner && !isOrgAdmin && !isBillingOwner) {
		return error(403, 'Only org owners, admins, or the billing contact can view billing.');
	}

	let invoices: import('stripe').Stripe.Invoice[] = [];
	let stripePortalUrl: string | null = null;
	let planName: string | null = null;

	const billingReturnUrl = getAbsoluteLocalizedUrl(getBaseUrl(), url.pathname);

	if (org.stripeCustomerId && orgSubscription) {
		[invoices, { url: stripePortalUrl }, planName] = await Promise.all([
			getOrgInvoices(org.stripeCustomerId),
			getStripePortalUrl(org.stripeCustomerId, billingReturnUrl),
			getSubscriptionPlanName(orgSubscription)
		]);
	}

	// Load owners only so the billing contact dropdown is restricted to owners.
	const members = isOrgOwner
		? await db
				.select({ userId: user.id, name: user.name, email: user.email })
				.from(membership)
				.innerJoin(user, eq(membership.userId, user.id))
				.where(
					and(eq(membership.organizationId, org.id), eq(membership.role, MembershipRole.OWNER))
				)
		: [];

	// If the stored billingOwnerId is no longer an owner (legacy), default to ''.
	const validBillingOwnerId =
		org.billingOwnerId && members.some((m) => m.userId === org.billingOwnerId)
			? org.billingOwnerId
			: '';

	const updateBillingOwnerForm = await superValidate(
		{ organizationId: org.id, billingOwnerId: validBillingOwnerId },
		zod4(updateBillingOwnerSchema()),
		{ errors: false }
	);

	return {
		orgSubscription,
		invoices,
		stripePortalUrl,
		planName,
		members,
		isOrgOwner,
		updateBillingOwnerForm,
		pageTitle: m.misty_teal_hawk_glow()
	};
};

export const actions: Actions = { updateOrganizationBillingOwner };
