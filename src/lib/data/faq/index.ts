import { m } from '$lib/paraglide/messages.js';

import accountAndBilling from './accountAndBilling';
import general from './general';
import product from './product';
import securityAndPrivacy from './securityAndPrivacy';

export const faqCategories = () => [
	{ id: 'general', title: m.proof_north_walrus_ask() },
	{ id: 'product', title: m.great_stock_poodle_link() },
	{
		id: 'securityAndPrivacy',
		title: m.gaudy_ago_firefox_tickle()
	},
	{
		id: 'accountAndBilling',
		title: m.icy_elegant_cockroach_value()
	}
];

export const faq = () => [
	...general(),
	...product(),
	...securityAndPrivacy(),
	...accountAndBilling()
];

export const shortFaq = () =>
	faq().filter(({ id }) =>
		['why', 'who', 'how', 'secretTypes', 'security', 'recovery', 'notification', 'save'].includes(
			id
		)
	);
