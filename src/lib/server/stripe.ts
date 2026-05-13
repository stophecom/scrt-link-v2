import Stripe from 'stripe';

import { STRIPE_SECRET_KEY } from '$env/static/private';
import { TierOptions } from '$lib/data/enums';

const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2025-02-24.acacia'
});

type StripeCustomer = Awaited<ReturnType<typeof stripeInstance.customers.retrieve>>;

export type StripeCustomerWithSubscription = StripeCustomer & {
	subscriptions: Stripe.ApiList<Stripe.Subscription> | undefined;
};

export default stripeInstance;

const PLAN_NAMES = [
	TierOptions.SECRET,
	TierOptions.TOP_SECRET,
	TierOptions.SECRET_SERVICE,
	TierOptions.TOP_SECRET_SERVICE
] as string[];

export const getActiveProducts = async () => {
	const { data } = await stripeInstance.products.list({ active: true, limit: 100 });

	// TierOptions.Confidential is the free option not covered on Stripe
	const mainProducts = data.filter((item) => PLAN_NAMES.includes(item.name));

	// Pair each main product with a companion base-fee product whose name starts with
	// "<mainProduct.name> " (e.g. "Secret Service — Base fee")
	return mainProducts.map((product) => ({
		...product,
		baseFeeProductId: data.find(
			(p) =>
				p.id !== product.id && !PLAN_NAMES.includes(p.name) && p.name.startsWith(product.name + ' ')
		)?.id
	}));
};

export const getActivePrices = async (productId: string, baseFeeProductId?: string) => {
	const priceLists = await Promise.all([
		stripeInstance.prices.list({ product: productId, active: true }),
		...(baseFeeProductId
			? [stripeInstance.prices.list({ product: baseFeeProductId, active: true })]
			: [])
	]);

	// Only licensed (quantity-based) prices; metered prices break checkout quantity
	const licensed = priceLists
		.flatMap((l) => l.data)
		.filter((p) => p.recurring?.usage_type === 'licensed');

	const prices = await Promise.all(
		licensed.map((item) =>
			stripeInstance.prices.retrieve(item.id, {
				expand: ['currency_options']
			})
		)
	);

	// Prices with a lookup_key containing '_base_' are flat base fees;
	// all others are per-seat prices
	return {
		seatPrices: prices.filter((p) => !p.lookup_key?.includes('_base_')),
		basePrices: prices.filter((p) => p.lookup_key?.includes('_base_'))
	};
};

const getCustomerWithSubscription = async (stripeCustomerId: string) =>
	(await stripeInstance.customers.retrieve(stripeCustomerId, {
		expand: ['subscriptions']
	})) as StripeCustomerWithSubscription;

export const getActiveSubscription = async (stripeCustomerId: string) => {
	const stripeCustomer = await getCustomerWithSubscription(stripeCustomerId);
	// We check if a user has a subscription.
	// We assume a customer only ever has one "active" subscription
	// An "active" subscription might have been canceled.
	// In this case the status remains "active" until "cancel_at" date is reached.
	// We consider "trialing" as "active" for our purposes

	let activeSubscriptions;
	if (stripeCustomer.subscriptions?.data.length) {
		activeSubscriptions = stripeCustomer.subscriptions.data.find(
			(el) => el.status === 'active' || el.status === 'trialing'
		);
	}

	return activeSubscriptions || null;
};

export const getStripePortalUrl = async (stripeCustomerId: string, returnUrl: string) =>
	await stripeInstance.billingPortal.sessions.create({
		customer: stripeCustomerId,
		return_url: returnUrl,
		locale: 'auto'
	});

export const getOrgInvoices = async (stripeCustomerId: string) => {
	const { data } = await stripeInstance.invoices.list({
		customer: stripeCustomerId,
		limit: 12
	});
	return data;
};

export const cancelSubscription = async (subscriptionId: string) =>
	await stripeInstance.subscriptions.update(subscriptionId, {
		cancel_at_period_end: true,
		trial_end: 'now'
		// cancel_at: Math.round(Date.now() / 1000) + 20, // For testing
	});
