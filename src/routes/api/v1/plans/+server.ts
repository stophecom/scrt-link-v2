import { json } from '@sveltejs/kit';
import { Stripe } from 'stripe';

import { Role } from '$lib/data/enums.js';
import { getActivePrices, getActiveProducts } from '$lib/server/stripe';

type PriceWithCurrencyOptions = Stripe.Price & {
	currency_options: Record<
		string,
		{
			custom_unit_amount: number | null;
			tax_behavior: Stripe.Price.TaxBehavior | null;
			unit_amount: number | null;
			unit_amount_decimal: number | null;
		}
	>;
};

// Stripe
export type Plan = {
	name: string;
	id: string;
	prices: { monthly: PriceWithCurrencyOptions; yearly: PriceWithCurrencyOptions };
};

export const GET = async ({ locals }) => {
	// Temporary guard (feature flag)
	const products = await getActiveProducts(locals.user?.role === Role.ADMIN);

	const getPlans = async () =>
		Promise.all(
			products.map(async (item) => {
				const prices = await getActivePrices(item.id);

				const priceByInterval = (interval: string) =>
					prices.find(({ recurring }) => recurring?.interval === interval);

				return {
					name: item.name,
					id: item.id,
					prices: { monthly: priceByInterval('month'), yearly: priceByInterval('year') }
				};
			})
		);

	return json(await getPlans());
};
