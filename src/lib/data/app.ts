import { Globe, Palette, Pencil } from 'lucide-svelte';
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
		title: 'Your own API',
		icon: Pencil,
		description: `Integrate secure sharing directly into your workflows and applications with our client module (REST API).`
	},
	{
		title: 'Advanced Controls',
		icon: Pencil,
		description: `Set custom expiration times, view limits, IP restrictions, and additional authentication layers.`
	},
	{
		title: 'Invisible Infrastructure',
		icon: Pencil,
		description: `Instead of being a consumer-facing app, become a secure sharing backend powering your other workflows.`
	},
	{
		title: 'Compliance Ready',
		icon: Pencil,
		description: `Match your company's look and feel with custom colors and domain support (secure.company.com).`
	}
];
