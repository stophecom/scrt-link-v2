import { Factory, Plane, Rocket, Send } from '@lucide/svelte';

import { SecretType, TierOptions } from '$lib/data/enums';
import { GB, MB } from '$lib/data/units';
import { formatBytes } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';

import { expiresInOptions, expiresInOptionsExtended } from './secretSettings';

// Defaults for visitors without account
const defaultLimits = {
	[SecretType.TEXT]: 150,
	[SecretType.FILE]: 10 * MB,
	[SecretType.REDIRECT]: false,
	[SecretType.SNAP]: false,
	[SecretType.NEOGRAM]: false,
	apiAccess: false,
	passwordAllowed: false,
	readReceiptsAllowed: false,
	expirationOptions: [] as number[],
	whiteLabel: false
};

export const plans = () => [
	{
		name: TierOptions.CONFIDENTIAL,
		icon: Send,
		title: m.tasty_awake_cobra_belong(),
		contents: [
			{ label: m.stale_fine_turkey_praise(), tooltip: m.warm_light_eel_glow() },
			{
				label: m.new_still_dingo_create({ limit: formatBytes(10 * MB) }),
				tooltip: m.soft_jade_owl_hoot()
			},
			{ label: m.loose_chunky_duck_intend(), tooltip: m.calm_blue_crow_peek() },
			{ label: m.agent_smart_dragonfly_dream() }
		],
		limits: {
			[SecretType.TEXT]: 150,
			[SecretType.FILE]: 10 * MB,
			[SecretType.REDIRECT]: true,
			[SecretType.SNAP]: false,
			[SecretType.NEOGRAM]: false,
			apiAccess: false,
			passwordAllowed: false,
			readReceiptsAllowed: false,
			expirationOptions: [],
			whiteLabel: false
		}
	},
	{
		name: TierOptions.SECRET,
		icon: Plane,
		subtitle: m.bold_quick_hawk_soar(),
		promotion: m.happy_witty_anteater_soar(),
		title: m.careful_inner_lynx_embrace(),
		contents: [
			{ label: m.long_tired_monkey_rest(), tooltip: m.swift_red_lynx_purr() },
			{ label: m.green_sour_mongoose_burn(), tooltip: m.quick_gold_fox_wink() },
			{ label: m.new_still_dingo_create({ limit: formatBytes(1 * GB) }) },
			{ label: m.pink_many_fox_boost(), tooltip: m.pure_mint_ram_leap() },
			{ label: m.slimy_livid_pelican_gleam(), tooltip: m.fresh_kind_panda_glow() },
			{ label: m.active_mellow_swan_list({ amount: 7 }) },
			{ label: m.tired_new_mantis_buy() }
		],
		limits: {
			[SecretType.TEXT]: 100_000,
			[SecretType.FILE]: 1 * GB,
			[SecretType.REDIRECT]: true,
			[SecretType.SNAP]: true,
			[SecretType.NEOGRAM]: true,
			apiAccess: false,
			passwordAllowed: true,
			readReceiptsAllowed: true,
			expirationOptions: expiresInOptions,
			whiteLabel: false
		}
	},
	{
		name: TierOptions.TOP_SECRET,
		icon: Rocket,
		subtitle: m.sharp_keen_wolf_dash(),
		title: m.crisp_fluffy_toucan_vent(),
		contents: [
			{ label: m.new_still_dingo_create({ limit: formatBytes(100 * GB) }) },
			{ label: m.active_mellow_swan_list({ amount: 30 }) },
			{ label: m.blue_jumpy_shell_climb(), tooltip: m.keen_rose_ant_zoom() },
			{ label: m.still_busy_starfish_dare() }
		],
		limits: {
			[SecretType.TEXT]: 100_000,
			[SecretType.FILE]: 100 * GB,
			[SecretType.REDIRECT]: true,
			[SecretType.SNAP]: true,
			[SecretType.NEOGRAM]: true,
			apiAccess: true,
			passwordAllowed: true,
			readReceiptsAllowed: true,
			expirationOptions: expiresInOptionsExtended,
			whiteLabel: false
		}
	},
	{
		name: TierOptions.SECRET_SERVICE, // Limits apply to owner and org members on white-label sites.
		icon: Factory,
		subtitle: m.brave_cool_bear_roam(),
		title: m.bold_warm_falcon_soar(),
		contents: [
			{ label: m.aloof_zany_cheetah_greet() },
			{ label: m.proud_cool_lemur_commend({ amount: 30 }) },
			{ label: m.muddy_any_tapir_roar() },
			{ label: m.calm_bright_otter_rest() },
			{ label: m.inner_fun_mink_push() }
		],
		limits: {
			[SecretType.TEXT]: 100_000,
			[SecretType.FILE]: 100 * GB,
			[SecretType.REDIRECT]: true,
			[SecretType.SNAP]: true,
			[SecretType.NEOGRAM]: true,
			apiAccess: true,
			passwordAllowed: true,
			readReceiptsAllowed: true,
			expirationOptions: expiresInOptionsExtended,
			whiteLabel: true
		}
	}
];

export const getPlanContents = (name?: string) => {
	const plan = plans().find((el) => el.name === name);

	if (!plan) {
		throw new Error(`No plan contents found with name: ${name} `);
	}
	return plan;
};

export const getUserPlanLimits = (tier?: TierOptions | null) => {
	let limits = defaultLimits;

	if (tier) {
		const plan = plans().find((el) => el.name === tier);

		if (plan?.limits) {
			limits = plan?.limits;
		}
	}
	return limits;
};
