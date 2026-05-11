import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { type Stripe } from 'stripe';

import { getBaseUrl } from '$lib/constants';
import { getAbsoluteLocalizedUrl } from '$lib/i18n';
import { db } from '$lib/server/db';
import { organization } from '$lib/server/db/schema';
import { getOrganizationsByUserId } from '$lib/server/organization';
import { getActiveSubscription, getStripePortalUrl } from '$lib/server/stripe';

import type { Plan } from '../../../api/v1/plans/+server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const stripeCustomerId = locals.user?.stripeCustomerId;

	let subscription: Stripe.Subscription | null = null;
	let orgSubscription: Stripe.Subscription | null = null;
	let plans: Plan[] | null = null;
	let orgId: string | null = null;

	try {
		const response = await fetch(`/api/v1/plans`);
		if (!response.ok) {
			throw Error(`Couldn't get plans from Stripe.`);
		}

		plans = await response.json();

		if (stripeCustomerId) {
			subscription = await getActiveSubscription(stripeCustomerId);
		}

		if (locals.user) {
			const orgs = await getOrganizationsByUserId(locals.user.id);
			const org = orgs[0];
			if (org) {
				orgId = org.id;
				const [orgRow] = await db
					.select()
					.from(organization)
					.where(eq(organization.id, org.id))
					.limit(1);
				if (orgRow?.stripeCustomerId) {
					orgSubscription = await getActiveSubscription(orgRow.stripeCustomerId);
				}
			}
		}
	} catch (e) {
		console.error(e);
		error(404, `Pricing page currently not available.`);
	}

	return { plans, subscription, orgSubscription, orgId };
};

export const actions: Actions = {
	manageSubscriptionOnStripe: async (event) => {
		const stripeCustomerId = event.locals.user?.stripeCustomerId;
		if (!stripeCustomerId) {
			return fail(401);
		}

		const { url } = await getStripePortalUrl(
			stripeCustomerId,
			`${getAbsoluteLocalizedUrl(getBaseUrl(), '/pricing')}`
		);

		if (!url) {
			return fail(401);
		}

		return redirect(303, url);
	}
};
