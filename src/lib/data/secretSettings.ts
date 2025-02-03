import * as m from '$lib/paraglide/messages.js';

const MIN = 1000 * 60;
const DAY = 24 * 60 * MIN;

export const getExpiresAtOptions = () => [
	{
		value: '10m',
		label: m.sleek_away_gull_gaze({ amount: 10 }),
		ms: 10 * MIN
	},
	{
		value: '1h',
		label: m.close_pink_ant_radiate(),
		ms: 60 * MIN
	},
	{
		value: '24h',
		label: m.raw_stout_felix_empower({ amount: 24 }),
		ms: DAY
	},
	{
		value: '7d',
		label: m.curly_few_parrot_savor({ amount: 7 }),
		ms: 7 * DAY
	},
	{
		value: '30d',
		label: m.curly_few_parrot_savor({ amount: 30 }),
		ms: 30 * DAY
	}
];

export const getReadReceiptOptions = () => [
	{
		value: 'none',
		label: 'None'
	},
	{
		value: 'email',
		label: 'Email'
	},
	{
		value: 'ntfy',
		label: 'Ntfy*'
	}
];
