import Stripe from 'stripe';

import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2025-02-24.acacia'
});

type StripeCustomer = Awaited<ReturnType<typeof stripeInstance.customers.retrieve>>;

export type StripeCustomerWithSubscription = StripeCustomer & {
	subscriptions: Stripe.ApiList<Stripe.Subscription> | undefined;
};

export default stripeInstance;

export const getActiveProducts = async () => await stripeInstance.products.list({ active: true });

export const getActivePrices = async (productId: string, currency: string) =>
	await stripeInstance.prices.list({
		product: productId,
		active: true,
		currency: currency
	});

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

export const cancelSubscription = async (subscriptionId: string) =>
	await stripeInstance.subscriptions.update(subscriptionId, {
		cancel_at_period_end: true,
		trial_end: 'now'
		// cancel_at: Math.round(Date.now() / 1000) + 20, // For testing
	});
