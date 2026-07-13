import { m } from '$lib/paraglide/messages.js';

const privacy = () => [
	{
		id: 'privacy-tracking',
		category: 'privacy',
		heading: m.privacy_faq_tracking_q(),
		body: m.privacy_faq_tracking_a()
	},
	{
		id: 'privacy-data',
		category: 'privacy',
		heading: m.privacy_faq_data_q(),
		body: m.privacy_faq_data_a()
	},
	{
		id: 'privacy-cookies',
		category: 'privacy',
		heading: m.privacy_faq_cookies_q(),
		body: m.privacy_faq_cookies_a()
	},
	{
		id: 'privacy-selling',
		category: 'privacy',
		heading: m.privacy_faq_selling_q(),
		body: m.privacy_faq_selling_a()
	},
	{
		id: 'privacy-anonymous',
		category: 'privacy',
		heading: m.privacy_faq_anonymous_q(),
		body: m.privacy_faq_anonymous_a()
	}
];

export default privacy;
