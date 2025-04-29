import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { TierOptions } from '$lib/data/enums';
import { db } from '$lib/server/db';
import { user, whiteLabelSite } from '$lib/server/db/schema';
import { removeContactFromAudience } from '$lib/server/resend';
import stripeInstance from '$lib/server/stripe';
import { sendSubscriptionTrialStartEmail } from '$lib/server/transactional-email';
import { getEnumFromString } from '$lib/typescript-helpers';

const webhookSecret: string = STRIPE_WEBHOOK_SECRET!;

export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text();
	const sig = request.headers.get('stripe-signature')!;

	let event: Stripe.Event;

	try {
		event = stripeInstance.webhooks.constructEvent(rawBody, sig, webhookSecret);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : 'Unexpected error';
		// On error, log and return the error message.
		console.error(e);
		throw new Error(errorMessage);
	}

	// Successfully constructed event.
	console.log('✅ Success:', event.id);

	switch (event.type) {
		case 'customer.subscription.created':
		case 'customer.subscription.deleted':
		case 'customer.subscription.updated': {
			const subscription = event.data.object as Stripe.Subscription;

			// If payment successful the status changes to active:
			// https://stripe.com/docs/api/subscriptions/object#subscription_object-status
			// Possible values are incomplete, incomplete_expired, trialing, active, past_due, canceled, unpaid, or paused.
			if (['trialing', 'active'].includes(subscription.status)) {
				try {
					const product = subscription.items.data[0].plan.product;
					console.log('Purchased product: ', product);
					console.log('Customer: ', subscription.customer);

					let purchasedTier = TierOptions.CONFIDENTIAL;

					if (typeof product === 'string') {
						// We get the purchased product name and map it to the predefined tier options.
						const plan = await stripeInstance.products.retrieve(product);

						console.log('Plan Name', plan.name);
						const mappedTierOption = getEnumFromString(TierOptions, plan.name);
						if (mappedTierOption) {
							console.log('Purchased tier option: ', mappedTierOption);
							purchasedTier = mappedTierOption;
						}
					}

					const [userResult] = await db
						.update(user)
						.set({
							subscriptionTier: purchasedTier
						})
						.where(eq(user.stripeCustomerId, subscription.customer as string))
						.returning();

					// We send purchase confirmation email
					if (subscription.status === 'trialing') {
						await sendSubscriptionTrialStartEmail(
							userResult.email,
							purchasedTier,
							userResult.name || ''
						);
					}

					// We remove customer from Resend MQL list
					try {
						const result = await removeContactFromAudience({ email: userResult.email });

						if (result.error) {
							throw Error(result.error.message);
						}
					} catch (error) {
						console.error(error);
					}

					console.log('✅ Subscription active:', event.type);
				} catch (e) {
					console.error(e);
				}
			} else if (['canceled', 'unpaid'].includes(subscription.status)) {
				// We downgrade only after a subscription has got the status canceled or unpaid.
				// We don't consider the other statuses.
				const [userResult] = await db
					.update(user)
					.set({
						subscriptionTier: TierOptions.CONFIDENTIAL
					})
					.where(eq(user.stripeCustomerId, subscription.customer as string))
					.returning();

				// We unpublish any white-label website.
				// Wrapped in try/catch since such a site might not exist.
				try {
					await db
						.update(whiteLabelSite)
						.set({ published: false })
						.where(eq(whiteLabelSite.userId, userResult.id));
				} catch (error) {
					console.error(error);
				}
			}

			break;
		}

		default: {
			console.warn(`Unhandled event type: ${event.type}`);
		}
	}

	// Return a response to acknowledge receipt of the event.
	return json({ success: true });
};
