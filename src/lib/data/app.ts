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
	Zap
} from 'lucide-svelte';

import { m } from '$lib/paraglide/messages.js';

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
		title: 'Your domain',
		icon: Globe,
		description: `Set your custom domain or subdomain (company.com or secure.company.com).`
	},
	{
		title: 'Custom branding',
		icon: Palette,
		description: `Match your company's look and feel with custom colors, logo and more.`
	},
	{
		title: 'API access',
		icon: Code,
		description: `Integrate secure sharing directly into your workflows and applications with our client module (REST API).`
	},
	{
		title: 'Invisible infrastructure',
		icon: Zap,
		description: `The service runs on industry-leading infrastructure. We do the heavy lifting.`
	},
	{
		title: 'Compliance ready',
		icon: ChartColumn,
		description: `Fully GDPR and CCPA compliant, with strong data protection.`
	},
	{
		title: 'Setup in 5min',
		icon: ShieldCheck,
		description: `Start protecting your customers' most sensitive data immediately.`
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
