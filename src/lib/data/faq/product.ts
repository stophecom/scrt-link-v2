import { m } from '$lib/paraglide/messages.js';

const product = () => [
	{
		id: 'notification',
		category: 'product',
		heading: m.actual_deft_salmon_bless(),
		body: m.these_loose_kitten_grin()
	},

	{
		id: 'secret-not-found',
		category: 'product',
		heading: m.dry_fun_ant_sail(),
		body: m.crazy_dark_tuna_stop()
	},
	{
		id: 'browser-extension',
		category: 'product',
		heading: m.browser_extension_faq_heading(),
		body: m.browser_extension_faq_body()
	}
];

export default product;
