import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import { type Stripe } from 'stripe';

import { getBaseUrl } from '$lib/constants';
import { MembershipRole } from '$lib/data/enums';
import { getAbsoluteLocalizedUrl } from '$lib/i18n';
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
	let orgName: string | null = null;
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
			// Uses first org only — multi-org pricing page is not yet supported.
			// We choose first org, where user is OWNER.
			const orgs = await getOrganizationsByUserId(locals.user.id);
			const ownerOrg = orgs.find((org) => org.role === MembershipRole.OWNER);

			if (ownerOrg) {
				orgId = ownerOrg.id;
				orgName = ownerOrg.name;
				if (ownerOrg.stripeCustomerId) {
					orgSubscription = await getActiveSubscription(ownerOrg.stripeCustomerId);
				}
			}
		}
	} catch (e) {
		console.error(e);
		error(404, `Pricing page currently not available.`);
	}

	return { plans, subscription, orgSubscription, orgId, orgName };
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
