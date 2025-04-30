import {
	Clock4,
	Code,
	Flame,
	Globe,
	Handshake,
	Infinity as InfinityIcon,
	Lock,
	LockKeyhole,
	Palette,
	ShieldCheck,
	ShieldEllipsisIcon,
	ShieldPlus,
	Timer,
	Trash2,
	Zap
} from 'lucide-svelte';

import { m } from '$lib/paraglide/messages.js';
import { localizeHref } from '$lib/paraglide/runtime';

export const appName = 'scrt.link';
export const emailSupport = 'support@scrt.link';
export const uptimerobotUrl = 'https://stats.uptimerobot.com/v5yqDuEr5z';
export const githubUrl = 'https://github.com/stophecom/scrt-link-v2';

export const privacyUsps = () => [
	{
		icon: LockKeyhole,
		text: m.sea_giant_flamingo_forgive()
	},
	{
		icon: ShieldPlus,
		text: m.gross_empty_lion_dash()
	},
	{
		icon: Flame,
		text: m.mean_smug_loris_cherish()
	}
];

export const subscriptionFeatures = () => [
	{
		title: m.crazy_big_kangaroo_attend(),
		icon: Clock4,
		description: m.best_inner_grizzly_revive()
	},
	{
		title: m.fine_basic_tapir_charm(),
		icon: InfinityIcon,
		description: m.ok_free_turtle_kiss()
	},
	{
		title: m.icy_topical_hare_peel(),
		icon: ShieldEllipsisIcon,
		description: m.legal_sleek_robin_engage()
	}
];

export const businessFeatures = () => [
	{
		title: m.red_noisy_beaver_roar(),
		icon: Globe,
		description: m.teary_broad_vole_feel({ domain: 'example.com', subdomain: 'share.example.com' })
	},
	{
		title: m.free_less_trout_peel(),
		icon: Palette,
		description: m.sweet_topical_gull_strive()
	},
	{
		title: m.few_away_tadpole_hope(),
		icon: Code,
		description: m.these_moving_fireant_pull()
	},
	{
		title: m.wide_zany_piranha_flow(),
		icon: Zap,
		description: m.loved_awful_okapi_revive({ SLA: `[SLA](${localizeHref('/sla')})` })
	},
	{
		title: m.ago_direct_squid_bless(),
		icon: ShieldCheck,
		description: m.proof_seemly_eagle_cry()
	},
	{
		title: m.dull_round_javelina_cheer(),
		icon: Timer,
		description: m.spare_grand_dove_fry()
	}
];

export const securityFeatures = () => [
	{
		title: m.tasty_free_mallard_bloom(),
		icon: Lock,
		description: m.misty_giant_snake_swim()
	},
	{
		title: m.grand_vivid_newt_dash(),
		icon: Trash2,
		description: m.true_whole_quail_dust()
	},
	{
		title: m.basic_sound_rabbit_believe(),
		icon: Handshake,
		description: m.proof_every_gadfly_edit()
	},
	{
		title: m.minor_top_reindeer_cherish(),
		icon: Zap,
		description: m.cozy_top_ocelot_work()
	}
];
