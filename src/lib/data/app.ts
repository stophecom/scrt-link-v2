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
