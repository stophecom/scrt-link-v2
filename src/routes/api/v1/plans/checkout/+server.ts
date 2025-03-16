import { error, json } from '@sveltejs/kit';
import type Stripe from 'stripe';

import { getBaseUrl } from '$lib/constants';
import { getAbsoluteLocalizedUrl } from '$lib/i18n';
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
	const { priceId } = body;

	try {
		// Create Checkout Sessions from body params.
		const params: Stripe.Checkout.SessionCreateParams = {
			locale: 'auto', // Set it to auto since we have languages that are not supported by Stripe
			mode: 'subscription',
			allow_promotion_codes: true,
			customer: locals.user.stripeCustomerId,
			line_items: [
				{
					price: priceId,
					// For metered billing, do not pass quantity
					quantity: 1
				}
			],
			// {CHECKOUT_SESSION_ID} is a string literal; do not change it!
			// the actual Session ID is returned in the query parameter when your customer
			// is redirected to the success page.
			success_url: getAbsoluteLocalizedUrl(
				getBaseUrl(),
				'/pricing?session_id={CHECKOUT_SESSION_ID}'
			),
			cancel_url: getAbsoluteLocalizedUrl(getBaseUrl(), '/pricing/canceled')
		};

		const checkoutSession: Stripe.Checkout.Session =
			await stripeInstance.checkout.sessions.create(params);

		return json(checkoutSession);
	} catch (e) {
		console.error(e);
		error(404, `Couldn't create checkout session.`);
	}
};
