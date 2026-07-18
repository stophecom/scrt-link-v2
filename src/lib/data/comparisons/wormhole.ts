import type { Comparison } from './types';

export const wormhole: Comparison = {
	slug: 'wormhole',
	name: 'Wormhole',
	website: 'https://wormhole.app',
	category: 'file-transfer',
	published: true,
	lastVerified: '2026-07-14',

	title: 'scrt.link vs Wormhole',
	lead: 'Wormhole is properly end-to-end encrypted and a pleasure to use. It expires everything in 24 hours and has no password option.',

	metaTitle: 'Wormhole Alternative — scrt.link vs Wormhole',
	metaDescription:
		'Comparing scrt.link and Wormhole.app: two end-to-end encrypted file sharing tools. Expiration, download limits, password protection, open source and text secrets side by side.',
	metaKeywords:
		'wormhole alternative, wormhole.app alternative, scrt.link vs wormhole, end-to-end encrypted file sharing, secure large file transfer',

	summary: `[Wormhole](https://wormhole.app) is one of the few file transfer services that gets encryption right. Files are encrypted in the browser with AES-GCM, and their security page is explicit: "The secret key is added to the URI fragment which is never sent to the server." Files over 5 GB switch to peer-to-peer transfer entirely. It is fast, elegant, and free.

Where it falls short is control and longevity. Everything expires in **24 hours** — that is the only option. **Password protection is not implemented** (it sits on their roadmap). There is no configurable download limit, no text-secret support, no API or CLI, and the app is **not fully open source** — only the streaming-encryption component is published.

scrt.link covers the same zero-knowledge ground and adds the controls: expiry from 10 minutes to 30 days, view limits, passwords, text secrets, an API and a CLI, all MIT-licensed.`,

	features: [
		{ label: 'End-to-end encrypted in the browser', scrtLink: true, competitor: true },
		{ label: 'Decryption key never reaches the server', scrtLink: true, competitor: true },
		{
			label: 'Open source',
			scrtLink: 'Yes (MIT)',
			competitor: 'Partial (streaming encryption only)'
		},
		{ label: 'Self-hostable', scrtLink: true, competitor: false },
		{ label: 'Max file size', scrtLink: 'Up to 100 GB', competitor: '10 GB (P2P above 5 GB)' },
		{ label: 'Expiration', scrtLink: '10 minutes – 30 days', competitor: '24 hours only' },
		{
			label: 'Configurable view / download limit',
			scrtLink: 'Up to 1,000 views',
			competitor: false
		},
		{ label: 'Password protection', scrtLink: 'Yes (paid plans)', competitor: 'Not implemented' },
		{ label: 'Text secrets (passwords, keys, notes)', scrtLink: true, competitor: false },
		{ label: 'One-time redirects & file requests', scrtLink: true, competitor: false },
		{ label: 'REST API', scrtLink: true, competitor: 'None official' },
		{ label: 'Official CLI', scrtLink: 'Yes (@scrt-link/cli)', competitor: 'None official' },
		{ label: 'Browser extension', scrtLink: 'Chrome & Firefox', competitor: false },
		{ label: 'Accounts, teams & audit logs', scrtLink: true, competitor: false },
		{ label: 'Custom domain / white-label', scrtLink: 'Yes (Business)', competitor: false },
		{ label: 'Ad-free', scrtLink: true, competitor: true },
		{ label: 'Works without an account', scrtLink: true, competitor: true }
	],

	keyDifferences: [
		{
			title: 'On encryption, they are right there with us',
			body: 'Wormhole encrypts in the browser and keeps the key in the URL fragment — the same zero-knowledge property scrt.link has. We are not going to manufacture a security gap that does not exist. If your only requirement is that the provider cannot read your files, Wormhole meets it.'
		},
		{
			title: '24 hours, take it or leave it',
			body: 'Every Wormhole link expires in 24 hours. That is a sensible default and a poor ceiling: a contractor who opens your email on Monday will find a dead link, and a link you want gone in ten minutes will sit there all day. scrt.link runs from 10 minutes to 30 days, and you set a view limit on top.'
		},
		{
			title: 'No password, and no way to add one',
			body: 'Password protection is listed on the Wormhole roadmap as planned, not shipped. So a Wormhole link is a bearer token: anyone who gets the URL — from a forwarded email, a screenshot, a Slack channel — gets the file. scrt.link lets you require a password on top of the link, so possession of the URL alone is not enough.'
		},
		{
			title: '"Open source" needs an asterisk',
			body: "Wormhole's FAQ says the source for its streaming-encryption implementation (based on RFC 8188) is open source. The application as a whole is not. So the crypto primitive is inspectable but the code that actually runs in your browser is not, and it cannot be self-hosted. scrt.link is MIT-licensed end to end, and you can run it yourself."
		}
	],

	chooseScrtLink: [
		'You need a link that lives longer than 24 hours — or dies much faster.',
		'You want **password protection** on top of the link.',
		'You need to send text secrets (credentials, keys) as well as files.',
		'You want a fully open-source codebase, an API, a CLI, and the option to self-host.'
	],

	chooseCompetitor: [
		'You want to send up to 10 GB, free, with no account and no fuss.',
		'The peer-to-peer transfer above 5 GB is genuinely useful to you.',
		'24 hours is exactly the lifetime you want, and a bare link is enough protection.',
		'You value a beautifully designed, single-purpose tool over a feature set.'
	],

	faq: [
		{
			heading: 'Is Wormhole end-to-end encrypted?',
			body: 'Yes. Wormhole encrypts files in the browser with AES-GCM and states that the secret key is placed in the URL fragment, which is never sent to the server. On encryption it is equivalent to scrt.link. The differences are control (24-hour expiry only, no password, no download limit) and transparency (only part of the code is open source).'
		},
		{
			heading: 'Can I password-protect a Wormhole link?',
			body: "No. Optional password protection appears on Wormhole's roadmap as a planned feature, not a shipped one. scrt.link supports password protection on paid plans, so a leaked link alone does not expose the file."
		},
		{
			heading: 'How long do Wormhole links last?',
			body: 'Wormhole links expire after 24 hours and the files are then permanently deleted. scrt.link links can be set to expire anywhere from 10 minutes to 30 days, and can also be destroyed after a set number of views.'
		},
		{
			heading: 'Is Wormhole open source?',
			body: 'Only partly. Wormhole publishes the source for its streaming-encryption implementation, but not the full application, and it cannot be self-hosted. scrt.link is MIT-licensed in its entirety and can be self-hosted. (Note: the GitHub repository named "wormhole-app/wormhole" is an unrelated project, not Wormhole.app.)'
		}
	]
};
