import Stripe from 'stripe';

import { STRIPE_SECRET_KEY } from '$env/static/private';
import { TierOptions } from '$lib/data/enums';
import { getEnumFromString } from '$lib/typescript-helpers';

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

/** Maps a subscription to a TierOptions by finding the first item whose product
 *  name matches a known tier (skips companion "...Base fee" products).
 *  Falls back to CONFIDENTIAL when nothing maps. */
export const deriveTierFromSubscription = async (
	subscription: Stripe.Subscription
): Promise<TierOptions> => {
	for (const item of subscription.items.data) {
		const productId = item.plan.product;
		if (typeof productId !== 'string') continue;
		const product = await stripeInstance.products.retrieve(productId);
		const tier = getEnumFromString(TierOptions, product.name);
		if (tier) return tier;
	}
	return TierOptions.CONFIDENTIAL;
};

/** Retrieves a completed checkout session with its subscription expanded. */
export const getCheckoutSession = async (sessionId: string) =>
	(await stripeInstance.checkout.sessions.retrieve(sessionId, {
		expand: ['subscription']
	})) as Stripe.Checkout.Session & { subscription: Stripe.Subscription | null };

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

export type OrgSubscriptionStats = {
	planName: TierOptions;
	seatCount: number;
	unitAmountCents: number;
	interval: 'month' | 'year';
	currency: string;
	/** Total cost normalized to a monthly equivalent (cents). */
	monthlyAmountCents: number;
};

/** Returns plan name and billing stats for an org subscription.
 *  Iterates items to find the seat-plan product; sums all items for total monthly cost. */
export const getOrgSubscriptionStats = async (
	subscription: Stripe.Subscription
): Promise<OrgSubscriptionStats> => {
	let planName = TierOptions.CONFIDENTIAL;
	let seatCount = 0;
	let unitAmountCents = 0;
	let interval: 'month' | 'year' = 'month';
	let currency = 'usd';
	let monthlyAmountCents = 0;

	for (const item of subscription.items.data) {
		const productId = item.plan.product;
		if (typeof productId !== 'string') continue;
		const product = await stripeInstance.products.retrieve(productId);
		const amount = item.plan.amount ?? 0;
		const qty = item.quantity ?? 1;
		const itemInterval = (item.plan.interval ?? 'month') as 'month' | 'year';
		monthlyAmountCents += (itemInterval === 'year' ? amount / 12 : amount) * qty;

		const tier = getEnumFromString(TierOptions, product.name);
		if (tier) {
			planName = tier;
			seatCount = qty;
			unitAmountCents = amount;
			interval = itemInterval;
			currency = item.plan.currency;
		}
	}

	return { planName, seatCount, unitAmountCents, interval, currency, monthlyAmountCents };
};

/** @deprecated Use getOrgSubscriptionStats instead. */
export const getSubscriptionPlanName = async (
	subscription: Stripe.Subscription
): Promise<TierOptions> => {
	const { planName } = await getOrgSubscriptionStats(subscription);
	return planName;
};
