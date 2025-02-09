import * as m from '$lib/paraglide/messages.js';

import { ReadReceiptOptions } from './schemaEnums';
import { DAY, MIN } from './units';

export const getExpiresInOptions = () => [
	{
		value: 10 * MIN, // Time period in milliseconds
		label: m.sleek_away_gull_gaze({ amount: 10 })
	},
	{
		value: 60 * MIN,
		label: m.close_pink_ant_radiate()
	},
	{
		value: DAY,
		label: m.raw_stout_felix_empower({ amount: 24 })
	},
	{
		value: 7 * DAY,
		label: m.curly_few_parrot_savor({ amount: 7 })
	},
	{
		value: 30 * DAY,
		label: m.curly_few_parrot_savor({ amount: 30 })
	}
];

export const getReadReceiptOptions = () => [
	{
		value: ReadReceiptOptions.NONE,
		label: m.vivid_super_husky_mend()
	},
	{
		value: ReadReceiptOptions.EMAIL,
		label: m.neat_nice_shad_engage()
	},
	{
		value: ReadReceiptOptions.NTFY,
		label: 'Ntfy*'
	}
];

export const getSecretTypes = () => [
	{
		value: 'text',
		label: m.happy_dizzy_angelfish_stir()
	},
	{
		value: 'file',
		label: m.nice_male_zebra_stop()
	},
	{
		value: 'redirect',
		label: m.bad_royal_kudu_nudge()
	},
	{
		value: 'snap',
		label: 'Snap'
	}
];
