import { error } from '@sveltejs/kit';
import { type Stripe } from 'stripe';

import { supportedCurrencies } from '$lib/client/constants';
import { getBaseUrl } from '$lib/constants';
import { getAbsoluteLocalizedUrl } from '$lib/i18n';
import { languageTag } from '$lib/paraglide/runtime';
import stripeInstance from '$lib/server/stripe';

import type { Plan } from '../../api/v1/plans/+server';
import type { PageServerLoad } from './$types';

type StripeCustomer = Awaited<ReturnType<typeof stripeInstance.customers.retrieve>>;

export type StripeCustomerWithSubscription = StripeCustomer & {
	subscriptions: Stripe.ApiList<Stripe.Subscription> | undefined;
};

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	const stripeCustomerId = locals.user?.stripeId;
	const currency = url.searchParams.get('currency') || 'usd';
	if (!supportedCurrencies.includes(currency)) {
		error(405, 'Currency not supported.');
	}

	let subscription: Stripe.Subscription | null = null;
	let stripePortalUrl: string | null = null;
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
			const stripeCustomer = (await stripeInstance.customers.retrieve(stripeCustomerId, {
				expand: ['subscriptions']
			})) as StripeCustomerWithSubscription;

			// Check if user has a subscription.
			// We assume a customer only ever has one subscription
			subscription = stripeCustomer.subscriptions?.data[0] || null;

			const { url } = await stripeInstance.billingPortal.sessions.create({
				customer: stripeCustomerId,
				return_url: `${getAbsoluteLocalizedUrl(getBaseUrl(), '/account', languageTag())}`,
				locale: 'auto'
			});

			stripePortalUrl = url;
		}
	} catch (e) {
		console.error(e);
		error(404, `Pricing page currently not available.`);
	}

	return { plans, subscription, stripePortalUrl };
};
