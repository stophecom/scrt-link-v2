import { json } from '@sveltejs/kit';
import { Stripe } from 'stripe';

import { getActivePrices, getActiveProducts } from '$lib/server/stripe';

import type { RequestEvent } from './$types';

// Stripe
export type Plan = {
	name: string;
	id: string;
	prices: { monthly: Stripe.Price; yearly: Stripe.Price };
};

export const GET = async ({ url }: RequestEvent) => {
	const { data } = await getActiveProducts();

	const currency = url.searchParams.get('currency') || 'usd';

	const getPlans = async () =>
		Promise.all(
			data.map(async (item) => {
				const { data } = await getActivePrices(item.id, currency);

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
