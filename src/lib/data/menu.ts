import {
	ConciergeBell,
	MessageCircleDashed,
	Paperclip,
	Redo2,
	TypeOutline,
	Zap
} from '@lucide/svelte';

import { m } from '$lib/paraglide/messages.js';

import { githubUrl } from './app';

export const secretMenu = () => [
	{
		icon: TypeOutline,
		href: '/text',
		label: m.aloof_caring_anteater_compose()
	},
	{
		icon: Paperclip,
		href: '/file',
		label: m.formal_aware_platypus_charm()
	},
	{
		icon: Redo2,
		href: '/redirect',
		label: m.just_mellow_moth_stab()
	},
	{
		icon: Zap,
		href: '/snap',
		label: m.awake_big_halibut_view()
	},
	{
		icon: MessageCircleDashed,
		href: '/neogram',
		label: 'Neogram'
	},
	{
		icon: ConciergeBell,
		href: '/account/requests',
		label: m.keen_swift_heron_ask(),
		badge: m.heavy_inclusive_yak_skip()
	}
];

export const productMenu = () => [
	{
		href: '/business',
		label: m.great_funny_beaver_gleam()
	},
	{
		href: '/pricing',
		label: m.moving_quaint_buzzard_trip()
	},
	{
		href: '/api-documentation',
		label: m.salty_sea_insect_fry()
	},
	{
		href: 'https://deepwiki.com/stophecom/scrt-link-v2',
		externalLink: true,
		label: 'Wiki'
	},
	{
		href: githubUrl,
		externalLink: true,
		label: 'Github'
	}
];

export const companyMenu = () => [
	{
		href: '/about',
		label: m.polite_misty_jan_hint()
	},
	{
		href: '/privacy',
		label: m.awake_frail_kitten_hush()
	},
	{
		href: '/security',
		label: m.nice_last_quail_pop()
	},
	{
		href: '/blog',
		label: m.crazy_tired_racoon_offer()
	}
];

export const helpMenu = () => [
	{
		href: '/contact',
		label: m.early_bright_salmon_comfort()
	},
	{
		href: '/faq',
		label: m.few_awful_chipmunk_trust()
	},
	{
		href: '/imprint',
		label: m.civil_dizzy_gopher_glow()
	}
];

const tos = () => ({
	href: '/terms-of-service',
	label: m.bad_white_baboon_zap()
});

const cookiePolicy = () => ({
	href: '/cookie-policy',
	label: m.dull_tidy_sawfish_find()
});

const privacyPolicy = () => ({
	href: '/privacy-policy',
	label: m.crazy_jumpy_mouse_hush()
});

const acceptableUsePolicy = () => ({
	href: '/acceptable-use-policy',
	label: m.blue_aqua_hornet_link()
});

const imprint = () => ({
	href: '/imprint',
	label: m.basic_cool_fish_conquer()
});

const sla = () => ({
	href: '/sla',
	label: 'Service Level Agreement (SLA)'
});

const gdpr = () => ({
	href: '/gdpr',
	label: 'GDPR'
});

export const useCasesMenu = () => [
	{
		href: '/use-cases/it-security',
		label: m.warm_calm_hawk_defend()
	},
	{
		href: '/use-cases/legal',
		label: m.clear_pure_owl_advise(),
		disabled: true
	},
	{
		href: '/use-cases/journalists',
		label: m.brave_sharp_fox_report(),
		disabled: true
	},
	{
		href: '/use-cases/support',
		label: m.kind_warm_bear_assist(),
		disabled: true
	}
];

export const mainNav = () => [
	{
		title: m.quick_proud_lion_guide(),
		items: useCasesMenu()
	},
	{
		title: m.tiny_suave_nils_accept(),
		items: productMenu().filter((item) =>
			['/business', '/pricing', '/api-documentation'].includes(item.href)
		)
	},
	{
		title: m.chunky_raw_osprey_dial(),
		items: companyMenu().filter((item) => ['/about', '/blog', '/security'].includes(item.href))
	},
	{
		title: m.equal_away_frog_aim(),
		items: helpMenu().filter((item) => ['/faq', '/contact'].includes(item.href))
	}
];

// Menus
export const legalMenu = () => [
	tos(),
	cookiePolicy(),
	privacyPolicy(),
	acceptableUsePolicy(),
	sla(),
	gdpr()
];
export const imprintMenu = () => [imprint(), gdpr(), privacyPolicy(), cookiePolicy()];
