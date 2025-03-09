import Stripe from 'stripe';

import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2025-02-24.acacia'
});
export default stripeInstance;
