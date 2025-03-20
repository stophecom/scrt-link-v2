import { m } from '$lib/paraglide/messages.js';

const accountAndBilling = () => [
	{
		id: 'payment-provider',
		category: 'accountAndBilling',
		heading: m.fuzzy_funny_eel_kiss(),
		body: m.away_hour_herring_jest({ paymentProcessor: '[Stripe](https://stripe.com/)' })
	},
	{
		id: 'payment-methods',
		category: 'accountAndBilling',
		heading: m.minor_last_rabbit_charm(),
		body: m.sour_these_bobcat_blend({ paymentProcessor: '[Stripe](https://stripe.com/)' })
	},
	{
		id: 'subscriptions',
		category: 'accountAndBilling',
		heading: m.key_game_albatross_enjoy(),
		body: m.flat_merry_cheetah_hope()
	},
	{
		id: 'promo-codes',
		category: 'accountAndBilling',
		heading: m.shy_low_stork_wish(),
		body: m.patchy_alert_warbler_stop()
	},
	{
		id: 'end-subscription',
		category: 'accountAndBilling',
		heading: m.smart_sunny_butterfly_persist(),
		body: m.spry_late_snake_quiz()
	}
];
export default accountAndBilling;
