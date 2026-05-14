import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { TierOptions } from '$lib/data/enums';
import { getBaseUrl } from '$lib/constants';
import { getAbsoluteLocalizedUrl, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { membership, user } from '$lib/server/db/schema';
import { updateOrganizationBillingOwner } from '$lib/server/form/actions';
import stripeInstance, { getOrgInvoices, getStripePortalUrl } from '$lib/server/stripe';
import { getEnumFromString } from '$lib/typescript-helpers';
import { updateBillingOwnerSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

async function getProductName(subscription: import('stripe').Stripe.Subscription) {
	let productName = TierOptions.CONFIDENTIAL;

	// With base-fee + seat line items, find the item whose product name
	// maps to a known TierOptions (skip companion "...Base fee" products)
	for (const item of subscription.items.data) {
		const productId = item.plan.product;
		if (typeof productId !== 'string') continue;
		const plan = await stripeInstance.products.retrieve(productId);
		const mappedTierOption = getEnumFromString(TierOptions, plan.name);
		if (mappedTierOption) {
			productName = mappedTierOption;
			break;
		}
	}
	return productName;
}

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
			getProductName(orgSubscription)
		]);
	}

	// Load members so owners can designate a billing contact.
	const members = isOrgOwner
		? await db
				.select({ userId: user.id, name: user.name, email: user.email })
				.from(membership)
				.innerJoin(user, eq(membership.userId, user.id))
				.where(eq(membership.organizationId, org.id))
		: [];

	const updateBillingOwnerForm = await superValidate(
		{ organizationId: org.id, billingOwnerId: org.billingOwnerId ?? '' },
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
