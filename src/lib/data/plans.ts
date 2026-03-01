import { Factory, Plane, Rocket, Send } from '@lucide/svelte';

import { isOriginalHost } from '$lib/app-routing';
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

const plans = () => [
	{
		name: TierOptions.CONFIDENTIAL,
		icon: Send,
		title: m.tasty_awake_cobra_belong(),
		contents: [
			m.stale_fine_turkey_praise(),
			m.new_still_dingo_create({ limit: formatBytes(10 * MB) }),
			m.loose_chunky_duck_intend(),
			m.agent_smart_dragonfly_dream()
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
		promotion: m.happy_witty_anteater_soar(),
		title: m.careful_inner_lynx_embrace(),
		contents: [
			m.long_tired_monkey_rest(),
			m.green_sour_mongoose_burn(),
			m.new_still_dingo_create({ limit: formatBytes(1 * GB) }),
			m.pink_many_fox_boost(),
			m.slimy_livid_pelican_gleam(),
			m.active_mellow_swan_list({ amount: 7 }),
			m.tired_new_mantis_buy()
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
		title: m.crisp_fluffy_toucan_vent(),
		contents: [
			m.new_still_dingo_create({ limit: formatBytes(100 * GB) }),
			m.active_mellow_swan_list({ amount: 30 }),
			m.blue_jumpy_shell_climb(),
			m.still_busy_starfish_dare()
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
		name: TierOptions.SECRET_SERVICE, // Limits apply to owner, contents apply to public (see below in getPlanLimits). @todo refactor this.
		icon: Factory,
		title: m.muddy_any_tapir_roar(),
		contents: [
			m.aloof_zany_cheetah_greet(),
			m.proud_cool_lemur_commend({ amount: 30 }),
			m.formal_mealy_chipmunk_advise(),
			m.new_still_dingo_create({ limit: formatBytes(100 * MB) }),
			m.ideal_low_mouse_splash(),
			m.active_mellow_swan_list({ amount: 7 }),
			m.inner_fun_mink_push()
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

export const getPlanLimits = (host: string, tier?: TierOptions | null) => {
	const isWhiteLabel = !isOriginalHost(host);

	// We make sure the plan limits for white-label prevent the display of UpgradeNotice within secret-form.
	// This is a workaround.
	// @todo We should make this less error-prone for the future.
	if (isWhiteLabel) {
		return {
			[SecretType.TEXT]: 100_000,
			[SecretType.FILE]: 100 * MB,
			[SecretType.REDIRECT]: true,
			[SecretType.SNAP]: true,
			[SecretType.NEOGRAM]: true,
			apiAccess: false,
			passwordAllowed: true,
			readReceiptsAllowed: false,
			expirationOptions: expiresInOptions,
			whiteLabel: false
		};
	} else {
		return getUserPlanLimits(tier);
	}
};
