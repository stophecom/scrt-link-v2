import { error } from '@sveltejs/kit';

import { getBaseUrl } from '$lib/constants';
import { getAbsoluteLocalizedUrl, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import stripeInstance, { getOrgInvoices, getStripePortalUrl } from '$lib/server/stripe';

import type { PageServerLoad } from './$types';

async function getProductName(subscription: import('stripe').Stripe.Subscription) {
	const productId = subscription.items.data[0]?.plan?.product;
	if (!productId || typeof productId !== 'string') return null;
	const product = await stripeInstance.products.retrieve(productId);
	return product.name;
}

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	const { org, orgSubscription, isOrgOwner } = await parent();
	if (!isOrgOwner) return error(403, 'Only org owners can view billing.');

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

	return {
		orgSubscription,
		invoices,
		stripePortalUrl,
		planName,
		pageTitle: m.misty_teal_hawk_glow()
	};
};
