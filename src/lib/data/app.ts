import {
	ChartColumn,
	Clock4,
	Code,
	Flame,
	Globe,
	Infinity as InfinityIcon,
	Lock,
	LockKeyhole,
	Palette,
	ShieldCheck,
	ShieldEllipsisIcon,
	ShieldPlus,
	Timer,
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
		title: 'End-to-End Encryption',
		icon: Lock,
		description: `All secrets are encrypted using AES-256-GCM (Advanced Encryption Standard - Galois/Counter Mode). The encryption key is never stored, but added to the secret link itself.`
	},
	{
		title: 'Permanent deletion',
		icon: Code,
		description: `After a secret has been viewed, we delete it permanently from our database. We regularly wipe our storage.`
	},
	{
		title: 'Minimal attack surface',
		icon: ChartColumn,
		description: `Set custom expiration times and additional authentication layers.`
	},
	{
		title: 'Trusted infrastructure',
		icon: Zap,
		description: `Our infrastructure is hosted by trusted industry leaders: Vercel for the API, website & Postgres Database, and Flow Swiss AG for object storage.`
	}
];
