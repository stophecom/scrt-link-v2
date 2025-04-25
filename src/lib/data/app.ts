import { ChartColumn, Code, Globe, Lock, Palette, ShieldCheck, Zap } from 'lucide-svelte';
import Flame from 'lucide-svelte/icons/flame';
import LockKeyhole from 'lucide-svelte/icons/lock-keyhole';
import ShieldPlus from 'lucide-svelte/icons/shield-plus';

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
