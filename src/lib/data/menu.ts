import * as m from '$lib/paraglide/messages.js';

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
