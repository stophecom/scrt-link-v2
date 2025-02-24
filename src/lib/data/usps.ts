import Flame from 'lucide-svelte/icons/flame';
import LockKeyhole from 'lucide-svelte/icons/lock-keyhole';
import ShieldPlus from 'lucide-svelte/icons/shield-plus';

import * as m from '$lib/paraglide/messages.js';

export const privacyUsps = [
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
