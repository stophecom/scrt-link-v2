import { error, json } from '@sveltejs/kit';
import type Stripe from 'stripe';

import { TRIAL_PERIOD_DAYS } from '$lib/client/constants';
import { getBaseUrl } from '$lib/constants';
import { getAbsoluteLocalizedUrl } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import stripeInstance from '$lib/server/stripe';

import type { RequestEvent } from '../$types';

export const POST = async ({ locals, request }: RequestEvent) => {
	if (!locals.user) {
		error(405, 'Not allowed. You need to be signed in.');
	}

	if (!locals.user.stripeCustomerId) {
		throw new Error('No stripe id associated with user.');
	}

	const body = await request.json();
	const { priceId, currency } = body;

	try {
		// Create Checkout Sessions from body params.
		const params: Stripe.Checkout.SessionCreateParams = {
			locale: 'auto', // Set it to auto since we have languages that are not supported by Stripe
			mode: 'subscription',
			allow_promotion_codes: true,
			customer: locals.user.stripeCustomerId,
			currency: currency,
			line_items: [
				{
					price: priceId,
					// For metered billing, do not pass quantity
					quantity: 1
				}
			],
			// Add 7 day trial
			subscription_data: {
				trial_period_days: TRIAL_PERIOD_DAYS
			},
			// {CHECKOUT_SESSION_ID} is a string literal; do not change it!
			// the actual Session ID is returned in the query parameter when your customer
			// is redirected to the success page.
			success_url: getAbsoluteLocalizedUrl(
				getBaseUrl(),
				'/pricing?session_id={CHECKOUT_SESSION_ID}'
			),
			cancel_url: getAbsoluteLocalizedUrl(getBaseUrl(), '/pricing')
		};

		const checkoutSession: Stripe.Checkout.Session =
			await stripeInstance.checkout.sessions.create(params);

		return json(checkoutSession);
	} catch (e) {
		console.error(e);
		error(404, `Couldn't create checkout session.`);
	}
};

export const PUT = async ({ locals, request }: RequestEvent) => {
	if (!locals.user) {
		error(405, 'Not allowed. You need to be signed in.');
	}

	if (!locals.user.stripeCustomerId) {
		throw new Error('No stripe id associated with user.');
	}

	const body = await request.json();
	const { subscriptionId, priceId } = body;

	const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId);
	const updatedSubscription: Stripe.Subscription = await stripeInstance.subscriptions.update(
		subscriptionId,
		{
			cancel_at_period_end: false,
			proration_behavior: 'create_prorations',
			items: [
				{
					id: subscription.items.data[0].id,
					price: priceId
				}
			]
		}
	);
	console.log(updatedSubscription);

	return json({ message: m.stout_zesty_gibbon_race() });
};
