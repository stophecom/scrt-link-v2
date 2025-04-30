import { m } from '$lib/paraglide/messages.js';

const business = () => [
	{
		id: 'business-why',
		category: 'business',
		heading: m.helpful_fair_beaver_accept(),
		body: 'scrt.link helps your team share sensitive data—like credentials, legal documents, access links, or other personal information—without exposing it to risk. It eliminates risky email attachments, insecure chat messages, and unnecessary retention of sensitive content, replacing them with ephemeral, encrypted links you control.'
	},
	{
		id: 'business-security',
		category: 'business',
		heading: 'How secure is scrt.link?',
		body: `Very. We use end-to-end encryption and industry-leading infrastructure. Secrets are encrypted in the browser before upload and are never stored in readable form. After viewing, they are permanently deleted from our servers.`
	},
	{
		id: 'business-integration',
		category: 'business',
		heading: 'Can we integrate scrt.link into our internal tools or workflows?',
		body: `Yes. scrt.link offers simple means to interact with API that lets you generate and manage secrets programmatically. It’s ideal for CI/CD pipelines, credential rotation, onboarding flows, or internal admin tools.`
	},
	{
		id: 'business-compliance',
		category: 'business',
		heading: 'What about compliance?',
		body: `We are GDPR/CCPA compliant. We keep personal data requirements at a minimum. In fact, for website users (guests), we don't collect any personal data at all.`
	},
	{
		id: 'business-customization',
		category: 'business',
		heading: 'Can we white-label or customize the experience?',
		body: `Business customers can create their own version of scrt.link in just minutes: Customize branding, domain and content. This ensures added trust and a seamless experience for your clients and teams.`
	}
];

export default business;
