import { json } from '@sveltejs/kit';
import { Stripe } from 'stripe';

import stripe from '$lib/server/stripe';

import type { RequestEvent } from './$types';

// Stripe
export type Plan = {
	name: string;
	id: string;
	prices: { monthly: Stripe.Price; yearly: Stripe.Price };
};

export const GET = async ({ url }: RequestEvent) => {
	const { data } = await stripe.products.list({ active: true });

	const currency = url.searchParams.get('currency');

	const getPlans = async () =>
		Promise.all(
			data.map(async (item) => {
				const { data } = await stripe.prices.list({
					product: item.id,
					active: true,
					currency: currency || 'usd'
				});

				const priceByInterval = (interval: string) =>
					data.find(({ recurring }) => recurring?.interval === interval);

				return {
					name: item.name,
					id: item.id,
					prices: { monthly: priceByInterval('month'), yearly: priceByInterval('year') }
				};
			})
		);

	return json(await getPlans());
};
