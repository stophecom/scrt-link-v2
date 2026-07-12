import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { TierOptions } from '$lib/data/enums';
import { db } from '$lib/server/db';
import { organization, stripeWebhookEvent, user, whiteLabelSite } from '$lib/server/db/schema';
import { removeContactFromAudience } from '$lib/server/resend';
import stripeInstance, {
	deriveTierFromSubscription,
	getActiveSubscription
} from '$lib/server/stripe';
import { sendSubscriptionTrialStartEmail } from '$lib/server/transactional-email';

const webhookSecret: string = STRIPE_WEBHOOK_SECRET!;

/** Best-effort extraction of the Stripe customer id for logging/filtering. */
const getCustomerId = (event: Stripe.Event): string | null => {
	const object = event.data.object as { customer?: string | Stripe.Customer | null };
	const customer = object?.customer;
	if (typeof customer === 'string') return customer;
	if (customer && typeof customer === 'object') return customer.id;
	return null;
};

/**
 * Resolves the tier a customer should currently have, based on their *live*
 * set of subscriptions in Stripe — NOT the status carried by a single event.
 * This makes handling order-independent and idempotent: a `canceled`/`deleted`
 * event for one subscription can no longer downgrade a customer who still holds
 * another active subscription.
 */
const resolveTargetTier = async (customerId: string): Promise<TierOptions> => {
	const activeSubscription = await getActiveSubscription(customerId);
	return activeSubscription
		? await deriveTierFromSubscription(activeSubscription)
		: TierOptions.CONFIDENTIAL;
};

const handleOrgSubscription = async (customerId: string): Promise<void> => {
	const targetTier = await resolveTargetTier(customerId);

	const [orgResult] = await db
		.update(organization)
		.set({ subscriptionTier: targetTier })
		.where(eq(organization.stripeCustomerId, customerId))
		.returning();

	if (!orgResult) {
		console.warn(`[webhook] no org found for customerId ${customerId}`);
		return;
	}

	// No active subscription remains → unpublish the white-label site.
	if (targetTier === TierOptions.CONFIDENTIAL) {
		await db
			.update(whiteLabelSite)
			.set({ published: false })
			.where(eq(whiteLabelSite.organizationId, orgResult.id));
	}

	console.log('✅ Org tier resolved:', customerId, targetTier);
};

const handleUserSubscription = async (event: Stripe.Event, customerId: string): Promise<void> => {
	const activeSubscription = await getActiveSubscription(customerId);
	const targetTier = activeSubscription
		? await deriveTierFromSubscription(activeSubscription)
		: TierOptions.CONFIDENTIAL;

	const [userResult] = await db
		.update(user)
		.set({ subscriptionTier: targetTier })
		.where(eq(user.stripeCustomerId, customerId))
		.returning();

	if (!userResult) {
		console.warn(`[webhook] no user found for customerId ${customerId}`);
		return;
	}

	if (targetTier === TierOptions.CONFIDENTIAL) {
		// No active subscription remains → unpublish the white-label site.
		await db
			.update(whiteLabelSite)
			.set({ published: false })
			.where(eq(whiteLabelSite.userId, userResult.id));
		console.log('✅ User downgraded to Confidential:', customerId);
		return;
	}

	// Customer has an active/trialing subscription.
	// Send the trial email only on the initial `created` event to avoid duplicates.
	if (activeSubscription?.status === 'trialing' && event.type === 'customer.subscription.created') {
		await sendSubscriptionTrialStartEmail(userResult.email, targetTier, userResult.name || '');
	}

	try {
		const result = await removeContactFromAudience({ email: userResult.email });
		if (result.error) throw Error(result.error.message);
	} catch (error) {
		console.error(error);
	}

	console.log('✅ User tier resolved:', customerId, targetTier);
};

/** Dispatches a verified Stripe event. Throws on failure so the caller can
 *  mark the event failed and return a non-2xx, letting Stripe retry. */
const processEvent = async (event: Stripe.Event): Promise<void> => {
	switch (event.type) {
		case 'customer.subscription.created':
		case 'customer.subscription.deleted':
		case 'customer.subscription.updated': {
			const subscription = event.data.object as Stripe.Subscription;
			const customerId = subscription.customer as string;

			// Org billing takes priority over personal billing for a given customer.
			const [orgResult] = await db
				.select()
				.from(organization)
				.where(eq(organization.stripeCustomerId, customerId))
				.limit(1);

			if (orgResult) {
				await handleOrgSubscription(customerId);
			} else {
				await handleUserSubscription(event, customerId);
			}
			break;
		}

		default: {
			console.warn(`Unhandled event type: ${event.type}`);
		}
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text();
	const sig = request.headers.get('stripe-signature')!;

	let event: Stripe.Event;

	try {
		event = stripeInstance.webhooks.constructEvent(rawBody, sig, webhookSecret);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : 'Unexpected error';
		console.error('[webhook] signature verification failed:', errorMessage);
		return new Response(errorMessage, { status: 400 });
	}

	// Idempotency + audit trail: record the event keyed on Stripe's event id.
	// `onConflictDoNothing` means a duplicate delivery inserts no new row.
	const [inserted] = await db
		.insert(stripeWebhookEvent)
		.values({
			eventId: event.id,
			type: event.type,
			customerId: getCustomerId(event),
			payload: event as unknown as Record<string, unknown>,
			status: 'received'
		})
		.onConflictDoNothing({ target: stripeWebhookEvent.eventId })
		.returning();

	if (!inserted) {
		// We've seen this event id before. Only skip if it was fully processed;
		// a previously-failed event is allowed to reprocess on Stripe's retry.
		const [existing] = await db
			.select({ status: stripeWebhookEvent.status })
			.from(stripeWebhookEvent)
			.where(eq(stripeWebhookEvent.eventId, event.id))
			.limit(1);

		if (existing?.status === 'processed') {
			console.log('[webhook] duplicate already processed, skipping:', event.id);
			return json({ success: true, duplicate: true });
		}
		console.log('[webhook] reprocessing previously failed event:', event.id);
	}

	try {
		await processEvent(event);

		await db
			.update(stripeWebhookEvent)
			.set({ status: 'processed', error: null, processedAt: new Date() })
			.where(eq(stripeWebhookEvent.eventId, event.id));

		return json({ success: true });
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : 'Unexpected error';
		console.error('[webhook] processing failed:', event.id, event.type, errorMessage);

		await db
			.update(stripeWebhookEvent)
			.set({ status: 'failed', error: errorMessage })
			.where(eq(stripeWebhookEvent.eventId, event.id));

		// Return 5xx so Stripe retries (with backoff, for ~3 days).
		return new Response(errorMessage, { status: 500 });
	}
};
