import * as m from '$lib/paraglide/messages.js';

export const freePlanName = 'Confidential';
export const premiumPlanName = 'Secret';
export const enterprisePlanName = 'Top Secret';

const plans = [
	{
		name: 'Confidential',
		title: m.tasty_awake_cobra_belong(),
		contents: [
			m.stale_fine_turkey_praise(),
			m.livid_patchy_mallard_dig(),
			m.loose_chunky_duck_intend(),
			m.long_tired_monkey_rest()
		]
	},
	{
		name: 'Secret',
		title: m.careful_inner_lynx_embrace(),
		contents: [
			m.new_still_dingo_create(),
			m.slimy_livid_pelican_gleam(),
			m.brave_alert_penguin_jolt(),
			m.pink_many_fox_boost(),
			m.tired_new_mantis_buy()
		]
	},
	{
		name: 'Top Secret',
		title: m.crisp_fluffy_toucan_vent(),
		contents: [m.active_mellow_swan_list(), m.still_busy_starfish_dare()]
	}
];

export const getPlanContents = (name: string) => {
	const plan = plans.find((el) => el.name === name);

	if (!plan) {
		throw new Error(`No plan contents found with name: ${name} `);
	}
	return plan;
};
