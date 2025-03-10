import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import { type Stripe } from 'stripe';

import { supportedCurrencies } from '$lib/client/constants';
import { getBaseUrl } from '$lib/constants';
import { getAbsoluteLocalizedUrl } from '$lib/i18n';
import { languageTag } from '$lib/paraglide/runtime';
import { getActiveSubscription, getStripePortalUrl } from '$lib/server/stripe';

import type { Plan } from '../../api/v1/plans/+server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	const stripeCustomerId = locals.user?.stripeCustomerId;
	const currency = url.searchParams.get('currency') || 'usd';
	if (!supportedCurrencies.includes(currency)) {
		error(405, 'Currency not supported.');
	}

	let subscription: Stripe.Subscription | null = null;

	let plans: Plan[] | null = null;

	try {
		const response = await fetch(`/api/v1/plans?currency=${currency}`);
		if (!response.ok) {
			throw Error(`Couldn't get plans from Stripe.`);
		}

		plans = await response.json();

		if (plans) {
			console.log('Load function called with URL:', plans[0].prices.monthly.id);
		}

		if (stripeCustomerId) {
			subscription = await getActiveSubscription(stripeCustomerId);
		}
	} catch (e) {
		console.error(e);
		error(404, `Pricing page currently not available.`);
	}

	return { plans, subscription };
};

export const actions: Actions = {
	manageSubscriptionOnStripe: async (event) => {
		const stripeCustomerId = event.locals.user?.stripeCustomerId;
		if (!stripeCustomerId) {
			return fail(401);
		}

		const { url } = await getStripePortalUrl(
			stripeCustomerId,
			`${getAbsoluteLocalizedUrl(getBaseUrl(), '/pricing', languageTag())}`
		);

		if (!url) {
			return fail(401);
		}

		return redirect(303, url);
	}
};
