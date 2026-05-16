import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { TierOptions } from '$lib/data/enums';
import { db } from '$lib/server/db';
import { organization, user, whiteLabelSite } from '$lib/server/db/schema';
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
			const customerId = subscription.customer as string;

			// Check if this customer belongs to an org (org billing takes priority)
			const [orgResult] = await db
				.select()
				.from(organization)
				.where(eq(organization.stripeCustomerId, customerId))
				.limit(1);

			if (orgResult) {
				// Org subscription event
				if (['trialing', 'active'].includes(subscription.status)) {
					try {
						let purchasedTier = TierOptions.CONFIDENTIAL;

						// With base-fee + seat line items, find the item whose product name
						// maps to a known TierOptions (skip companion "...Base fee" products)
						for (const item of subscription.items.data) {
							const productId = item.plan.product;
							console.log('Purchased product: ', productId);
							console.log('Customer: ', customerId);
							if (typeof productId !== 'string') continue;
							const plan = await stripeInstance.products.retrieve(productId);
							const mappedTierOption = getEnumFromString(TierOptions, plan.name);
							if (mappedTierOption) {
								purchasedTier = mappedTierOption;
								break;
							}
						}

						await db
							.update(organization)
							.set({ subscriptionTier: purchasedTier })
							.where(eq(organization.stripeCustomerId, customerId));

						console.log('✅ Org subscription active:', event.type, purchasedTier);
					} catch (e) {
						console.error(e);
					}
				} else if (['canceled', 'unpaid'].includes(subscription.status)) {
					const [orgResult] = await db
						.update(organization)
						.set({ subscriptionTier: TierOptions.CONFIDENTIAL })
						.where(eq(organization.stripeCustomerId, customerId))
						.returning();

					try {
						await db
							.update(whiteLabelSite)
							.set({ published: false })
							.where(eq(whiteLabelSite.organizationId, orgResult.id));
					} catch (error) {
						console.error(error);
					}
				}
			} else if (['trialing', 'active'].includes(subscription.status)) {
				// Personal subscription event
				try {
					const product = subscription.items.data[0].plan.product;
					console.log('Purchased product: ', product);
					console.log('Customer: ', customerId);

					let purchasedTier = TierOptions.CONFIDENTIAL;

					if (typeof product === 'string') {
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
						.set({ subscriptionTier: purchasedTier })
						.where(eq(user.stripeCustomerId, customerId))
						.returning();

					if (subscription.status === 'trialing') {
						await sendSubscriptionTrialStartEmail(
							userResult.email,
							purchasedTier,
							userResult.name || ''
						);
					}

					try {
						const result = await removeContactFromAudience({ email: userResult.email });
						if (result.error) throw Error(result.error.message);
					} catch (error) {
						console.error(error);
					}

					console.log('✅ Subscription active:', event.type);
				} catch (e) {
					console.error(e);
				}
			} else if (['canceled', 'unpaid'].includes(subscription.status)) {
				const [userResult] = await db
					.update(user)
					.set({ subscriptionTier: TierOptions.CONFIDENTIAL })
					.where(eq(user.stripeCustomerId, customerId))
					.returning();

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
