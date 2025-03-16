import * as m from '$lib/paraglide/messages.js';

import { ReadReceiptOptions, SecretType, ThemeOptions } from './enums';
import { DAY, MIN } from './units';

export const getExpiresInOptions = (extended?: boolean) => {
	const options = [
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
			label: `${m.curly_few_parrot_savor({ amount: 30 })} ${!extended ? `${m.vexed_dirty_loris_bump()}` : ''}`,
			disabled: !extended
		}
	];

	return options;
};

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

export const getThemeOptions = () => [
	{
		value: ThemeOptions.PINK,
		label: 'Pink'
	},
	{
		value: ThemeOptions.PURPLE,
		label: 'Purple'
	},
	{
		value: ThemeOptions.BLUE,
		label: 'Blue'
	},
	{
		value: ThemeOptions.TEAL,
		label: 'Teal'
	}
];

export const getSecretTypes = () => [
	{
		value: SecretType.TEXT,
		label: m.happy_dizzy_angelfish_stir()
	},
	{
		value: SecretType.FILE,
		label: m.nice_male_zebra_stop()
	},
	{
		value: SecretType.REDIRECT,
		label: m.bad_royal_kudu_nudge()
	},
	{
		value: SecretType.SNAP,
		label: 'Snap'
	},
	{
		value: SecretType.NEOGRAM,
		label: 'Neogram'
	}
];
