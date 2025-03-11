import User from 'lucide-svelte/icons/user';

import * as m from '$lib/paraglide/messages.js';

import { githubUrl } from './app';

export const secretMenu = () => [
	{
		href: '/text',
		label: m.aloof_caring_anteater_compose()
	},
	{
		href: '/file',
		label: m.formal_aware_platypus_charm()
	},
	{
		href: '/redirect',
		label: m.just_mellow_moth_stab()
	},
	{
		href: '/snap',
		label: m.awake_big_halibut_view()
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
		href: githubUrl,
		externalLink: true,
		label: 'Github'
	}
];

const account = {
	icon: User,
	href: '/account',
	label: m.novel_proud_anaconda_zoom()
};

export const accountMenuHeader = () => [account];

const tos = {
	href: '/terms-of-service',
	label: m.petty_strong_owl_fond()
};

const cookiePolicy = {
	href: '/cookie-policy',
	label: m.dull_tidy_sawfish_find()
};

const privacyPolicy = {
	href: '/privacy-policy',
	label: m.loved_ago_pug_tend()
};

const acceptableUsePolicy = {
	href: '/acceptable-use-policy',
	label: m.blue_aqua_hornet_link()
};

const imprint = {
	href: '/imprint',
	label: m.basic_cool_fish_conquer()
};

// Menus
export const legalMenu = () => [tos, cookiePolicy, privacyPolicy, acceptableUsePolicy];
export const imprintMenu = () => [imprint, privacyPolicy, cookiePolicy];
