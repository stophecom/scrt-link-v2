import {
	Clock4,
	Flame,
	Handshake,
	Infinity as InfinityIcon,
	Lock,
	LockKeyhole,
	ShieldCheck,
	ShieldEllipsisIcon,
	ShieldPlus,
	Zap
} from '@lucide/svelte';

import { m } from '$lib/paraglide/messages.js';
import { localizeHref } from '$lib/paraglide/runtime';

export const appName = 'scrt.link';
export const whiteLabelDemoWebsite = 'https://br3f.com';
export const emailSupport = 'support@scrt.link';
export const emailNoReply = 'no-reply@scrt.link';
export const uptimerobotUrl = 'https://stats.uptimerobot.com/v5yqDuEr5z';
export const githubUrl = 'https://github.com/stophecom/scrt-link-v2';
export const chromeExtensionUrl =
	'https://chromewebstore.google.com/detail/scrtlink-%E2%80%94-share-a-secret/ljcmmhacpghmooiojfdiekokhefopmmh';
export const firefoxExtensionUrl =
	'https://addons.mozilla.org/en-US/firefox/addon/scrt-link-share-a-secret/';
export const edgeExtensionUrl =
	'https://microsoftedge.microsoft.com/addons/detail/scrtlink-%E2%80%94-share-a-secre/eaehlboohgmeoflgdnkeigdogefihlbj';
export const blueskyUrl = 'https://bsky.app/profile/scrt.link';
export const linkedinUrl = 'https://www.linkedin.com/company/santihans';
export const santihansUrl = 'https://www.santihans.com';

export const privacyFeatures = () => [
	{
		icon: LockKeyhole,
		text: m.sea_giant_flamingo_forgive()
	},
	{
		icon: ShieldPlus,
		text: m.calm_proud_swan_host()
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

export const businessTrustFeatures = () => [
	{
		title: m.flat_zany_baboon_adapt(),
		icon: Lock,
		description: m.misty_giant_snake_swim()
	},
	{
		title: m.icy_topical_hare_peel(),
		icon: ShieldCheck,
		description: m.business_compliance_description({
			DPA: `[${m.dpa_title()}](${localizeHref('/dpa')})`
		})
	},
	{
		title: m.basic_sound_rabbit_believe(),
		icon: Handshake,
		description: m.proof_every_gadfly_edit()
	},
	{
		title: m.wide_zany_piranha_flow(),
		icon: Zap,
		description: m.loved_awful_okapi_revive({ SLA: `[SLA](${localizeHref('/sla')})` })
	}
];
