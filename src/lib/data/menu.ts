import { MessageCircleDashed, Paperclip, Redo2, TypeOutline, Zap } from 'lucide-svelte';

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
	}
];

export const aboutMenu = () => [
	{
		href: '/about',
		label: m.sour_sound_porpoise_bloom()
	},
	{
		href: '/privacy',
		label: m.red_round_cuckoo_embrace()
	},
	{
		href: '/security',
		label: m.warm_spry_jay_stir()
	},
	{
		href: '/pricing',
		label: m.same_that_cowfish_trip()
	},
	{
		href: '/blog',
		label: m.such_last_giraffe_cut()
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
		href: '/developers',
		label: m.salty_sea_insect_fry()
	},
	{
		href: githubUrl,
		externalLink: true,
		label: 'Github'
	}
];

const tos = () => ({
	href: '/terms-of-service',
	label: m.petty_strong_owl_fond()
});

const cookiePolicy = () => ({
	href: '/cookie-policy',
	label: m.dull_tidy_sawfish_find()
});

const privacyPolicy = () => ({
	href: '/privacy-policy',
	label: m.loved_ago_pug_tend()
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
	label: 'SLA'
});

// Menus
export const legalMenu = () => [
	tos(),
	cookiePolicy(),
	privacyPolicy(),
	acceptableUsePolicy(),
	sla()
];
export const imprintMenu = () => [imprint(), privacyPolicy(), cookiePolicy()];
