import { error, json, type RequestHandler } from '@sveltejs/kit';

import * as m from '$lib/paraglide/messages.js';
import stripeInstance from '$lib/server/stripe';

export const DELETE: RequestHandler = async ({ params }) => {
	const subscriptionId = params.id;

	try {
		if (!subscriptionId) {
			throw Error('No subscription id provided.');
		}

		await stripeInstance.subscriptions.update(subscriptionId, {
			cancel_at_period_end: true,
			trial_end: 'now'
			// cancel_at: Math.round(Date.now() / 1000) + 20, // For testing
		});
		return json({ success: true });
	} catch (e) {
		console.error(e);

		error(400, m.weird_key_stork_dazzle());
	}
};
