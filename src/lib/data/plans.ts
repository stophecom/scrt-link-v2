import * as m from '$lib/paraglide/messages.js';

import { SecretType, TierOptions } from './enums';
import { GB, MB } from './units';

const plans = () => [
	{
		name: TierOptions.CONFIDENTIAL,
		title: m.tasty_awake_cobra_belong(),
		contents: [
			m.stale_fine_turkey_praise(),
			m.livid_patchy_mallard_dig(),
			m.loose_chunky_duck_intend(),
			m.long_tired_monkey_rest()
		],
		limits: {
			[SecretType.TEXT]: 150,
			[SecretType.FILE]: 10 * MB,
			[SecretType.REDIRECT]: true,
			[SecretType.SNAP]: false,
			passwordAllowed: false,
			expirationOptionsAllowed: false
		}
	},
	{
		name: TierOptions.SECRET,
		title: m.careful_inner_lynx_embrace(),
		contents: [
			m.new_still_dingo_create(),
			m.slimy_livid_pelican_gleam(),
			m.brave_alert_penguin_jolt(),
			m.pink_many_fox_boost(),
			m.tired_new_mantis_buy()
		],
		limits: {
			[SecretType.TEXT]: 100_000,
			[SecretType.FILE]: 1 * GB,
			[SecretType.REDIRECT]: true,
			[SecretType.SNAP]: true,
			passwordAllowed: true,
			expirationOptionsAllowed: true
		}
	},
	{
		name: TierOptions.TOP_SECRET,
		title: m.crisp_fluffy_toucan_vent(),
		contents: [m.active_mellow_swan_list(), m.still_busy_starfish_dare()],
		limits: {
			[SecretType.TEXT]: 100_000,
			[SecretType.FILE]: 100 * GB,
			[SecretType.REDIRECT]: true,
			[SecretType.SNAP]: true,
			passwordAllowed: true,
			expirationOptionsAllowed: true
		}
	}
];

export const getPlanContents = (name: string) => {
	const plan = plans().find((el) => el.name === name);

	if (!plan) {
		throw new Error(`No plan contents found with name: ${name} `);
	}
	return plan;
};

export const getPlanLimits = (name?: string | null) => {
	let limits = {
		// Defaults for visitors without account
		[SecretType.TEXT]: 150,
		[SecretType.FILE]: 10 * MB,
		[SecretType.REDIRECT]: false,
		[SecretType.SNAP]: false,
		passwordAllowed: false,
		expirationOptionsAllowed: false
	};

	if (name) {
		const plan = plans().find((el) => el.name === name);

		if (plan?.limits) {
			limits = plan?.limits;
		}
	}
	return limits;
};
