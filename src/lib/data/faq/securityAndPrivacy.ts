import { m } from '$lib/paraglide/messages.js';

const securityAndPrivacy = () => [
	{
		id: 'security',
		category: 'securityAndPrivacy',
		heading: m.such_sad_mayfly_express(),
		body: m.gross_helpful_bee_attend()
	},
	{
		id: 'anonymity',
		category: 'securityAndPrivacy',
		heading: m.main_smart_deer_learn(),
		body: m.aqua_home_rooster_amuse()
	},
	{
		id: 'end-to-end-encryption-info',
		category: 'securityAndPrivacy',
		heading: m.smug_even_mammoth_nudge(),
		body: m.lofty_cozy_loris_praise({
			illustration: `![Link explanation](/images/url-explained.svg)`
		})
	},
	{
		id: 'recovery',
		category: 'securityAndPrivacy',
		heading: m.moving_ago_eel_burn(),
		body: m.simple_zesty_albatross_link()
	},
	{
		id: 'save',
		category: 'securityAndPrivacy',
		heading: m.yummy_lazy_jay_jump(),
		body: m.cute_lofty_baboon_hack()
	},
	{
		id: 'secret-expiration',
		category: 'securityAndPrivacy',
		heading: m.red_hour_shark_win(),
		body: m.late_shy_marmot_bake()
	}
];

export default securityAndPrivacy;
