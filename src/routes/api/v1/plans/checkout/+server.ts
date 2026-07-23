import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';

import { TRIAL_PERIOD_DAYS } from '$lib/client/constants';
import { getBaseUrl } from '$lib/constants';
import { MembershipRole } from '$lib/data/enums';
import { getAbsoluteLocalizedUrl } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { organization, user } from '$lib/server/db/schema';
import {
	getMembersByOrganizationId,
	getOrganizationsByUserId,
	getOrgBillingEmail
} from '$lib/server/organization';
import stripeInstance from '$lib/server/stripe';

import type { RequestEvent } from '../$types';

export const POST = async ({ locals, request }: RequestEvent) => {
	if (!locals.user) {
		error(405, 'Not allowed. You need to be signed in.');
	}

	const body = await request.json();
	const { priceId, currency, orgId, basePriceId } = body;

	// Org plan checkout
	if (orgId) {
		const userOrgs = await getOrganizationsByUserId(locals.user.id);
		const userOrg = userOrgs.find((o) => o.id === orgId && o.role === MembershipRole.OWNER);
		if (!userOrg) {
			error(403, 'Not allowed. You must be the owner of this organization.');
		}

		const [org] = await db.select().from(organization).where(eq(organization.id, orgId)).limit(1);

		// Get or create Stripe customer for the org
		let stripeCustomerId = org.stripeCustomerId;
		if (!stripeCustomerId) {
			// Seed the customer email from the org's billing owner (not just whoever
			// runs checkout), falling back to the acting user.
			const billingEmail = await getOrgBillingEmail(org.id, locals.user.email);
			const customer = await stripeInstance.customers.create({
				name: org.name,
				email: billingEmail,
				metadata: { organizationId: org.id }
			});
			stripeCustomerId = customer.id;
			await db.update(organization).set({ stripeCustomerId }).where(eq(organization.id, orgId));
		}

		const members = await getMembersByOrganizationId(orgId);
		const quantity = Math.max(members.length, 1);

		try {
			const params: Stripe.Checkout.SessionCreateParams = {
				locale: 'auto',
				mode: 'subscription',
				allow_promotion_codes: true,
				customer: stripeCustomerId,
				currency,
				line_items: [
					...(basePriceId ? [{ price: basePriceId, quantity: 1 }] : []),
					{ price: priceId, quantity }
				],
				subscription_data: {
					trial_period_days: TRIAL_PERIOD_DAYS,
					metadata: { organizationId: orgId }
				},
				success_url: getAbsoluteLocalizedUrl(
					getBaseUrl(),
					'/upgrade-success?session_id={CHECKOUT_SESSION_ID}'
				),
				cancel_url: getAbsoluteLocalizedUrl(getBaseUrl(), '/pricing')
			};
			const checkoutSession = await stripeInstance.checkout.sessions.create(params);
			return json(checkoutSession);
		} catch (e) {
			console.error(e);
			error(404, `Couldn't create checkout session.`);
		}
	}

	// Personal plan checkout

	// Get or create Stripe customer for the user
	let stripeCustomerId = locals.user.stripeCustomerId;
	if (!stripeCustomerId) {
		const customer = await stripeInstance.customers.create({
			email: locals.user.email,
			metadata: { userId: locals.user.id }
		});
		stripeCustomerId = customer.id;
		await db.update(user).set({ stripeCustomerId }).where(eq(user.id, locals.user.id));
	}

	try {
		const params: Stripe.Checkout.SessionCreateParams = {
			locale: 'auto',
			mode: 'subscription',
			allow_promotion_codes: true,
			customer: stripeCustomerId,
			currency,
			line_items: [{ price: priceId, quantity: 1 }],
			subscription_data: {
				trial_period_days: TRIAL_PERIOD_DAYS
			},
			success_url: getAbsoluteLocalizedUrl(
				getBaseUrl(),
				'/upgrade-success?session_id={CHECKOUT_SESSION_ID}'
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

	const body = await request.json();
	const { subscriptionId, priceId, orgId, basePriceId } = body;

	let expectedStripeCustomer: string | null = null;

	if (orgId) {
		const userOrgs = await getOrganizationsByUserId(locals.user.id);
		const userOrg = userOrgs.find((o) => o.id === orgId && o.role === MembershipRole.OWNER);
		if (!userOrg) {
			error(403, 'Not allowed. You must be the owner of this organization.');
		}
		const [org] = await db
			.select({ stripeCustomerId: organization.stripeCustomerId })
			.from(organization)
			.where(eq(organization.id, orgId))
			.limit(1);
		expectedStripeCustomer = org?.stripeCustomerId ?? null;
	} else if (!locals.user.stripeCustomerId) {
		throw new Error('No stripe id associated with user.');
	} else {
		expectedStripeCustomer = locals.user.stripeCustomerId;
	}

	const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId);

	if (expectedStripeCustomer && subscription.customer !== expectedStripeCustomer) {
		error(403, 'Subscription does not belong to this account.');
	}
	const items = subscription.items.data;
	const seatItem = items.find((i) => !i.price.lookup_key?.includes('_base_')) ?? items[0];
	const baseItem = items.find((i) => i.price.lookup_key?.includes('_base_'));

	await stripeInstance.subscriptions.update(subscriptionId, {
		cancel_at_period_end: false,
		proration_behavior: 'create_prorations',
		items: [
			{ id: seatItem.id, price: priceId },
			...(baseItem && basePriceId ? [{ id: baseItem.id, price: basePriceId }] : [])
		]
	});

	return json({ message: m.stout_zesty_gibbon_race() });
};
