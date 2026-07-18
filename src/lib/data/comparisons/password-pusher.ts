import type { Comparison } from './types';

export const passwordPusher: Comparison = {
	slug: 'password-pusher',
	name: 'Password Pusher',
	website: 'https://pwpush.com',
	category: 'secret-sharing',
	published: true,
	lastVerified: '2026-07-14',

	title: 'scrt.link vs Password Pusher',
	lead: 'Password Pusher is a mature, feature-rich tool for teams. It encrypts on the server — which means the server can read your secret.',

	metaTitle: 'Password Pusher Alternative — scrt.link vs Password Pusher (pwpush)',
	metaDescription:
		'Comparing scrt.link and Password Pusher (pwpush): end-to-end vs server-side encryption, file sharing, view limits, audit logs and pricing, side by side.',
	metaKeywords:
		'password pusher alternative, pwpush alternative, scrt.link vs password pusher, secure password sharing, end-to-end encrypted password link',

	summary: `[Password Pusher](https://pwpush.com) has been around since 2011, is Apache-2.0 licensed, and is genuinely well built — it has expiry by days *and* views, audit logs, teams, an API, a CLI and a browser extension. For IT teams it is a serious option.

The architectural difference is encryption. Password Pusher encrypts secrets **in its database, with keys the application holds**. Their own FAQ concedes that users of the hosted service cannot verify the running code matches the open-source code, and recommends self-hosting for maximum assurance. scrt.link encrypts in your browser: the key lives in the URL fragment and never reaches us, so there is nothing on our side to compromise.

The other practical catch: on the hosted pwpush.com, **file sharing is a paid feature**. It is free if you self-host.`,

	features: [
		{ label: 'End-to-end encrypted in the browser', scrtLink: true, competitor: false },
		{
			label: 'Decryption key never reaches the server',
			scrtLink: true,
			competitor: false
		},
		{ label: 'Open source', scrtLink: 'Yes (MIT)', competitor: 'Yes (Apache-2.0, open core)' },
		{ label: 'Self-hostable', scrtLink: true, competitor: true },
		{
			label: 'File sharing',
			scrtLink: 'Up to 100 GB',
			competitor: 'Paid on pwpush.com, free self-hosted'
		},
		{
			label: 'Expiration',
			scrtLink: '10 minutes – 30 days',
			competitor: '1 – 90 days'
		},
		{
			label: 'Configurable view limit',
			scrtLink: 'Up to 1,000 views',
			competitor: '1 – 100 views'
		},
		{ label: 'Password protection', scrtLink: 'Yes (paid plans)', competitor: true },
		{ label: 'Audit logs', scrtLink: 'Yes (Business)', competitor: 'Paid plans' },
		{ label: 'One-time redirects', scrtLink: true, competitor: false },
		{ label: 'File requests (receive secrets)', scrtLink: true, competitor: 'Paid plans' },
		{ label: 'REST API', scrtLink: true, competitor: true },
		{ label: 'Official CLI', scrtLink: 'Yes (@scrt-link/cli)', competitor: true },
		{ label: 'Browser extension', scrtLink: 'Chrome & Firefox', competitor: 'Chrome (beta)' },
		{ label: 'Custom domain / white-label', scrtLink: 'Yes (Business)', competitor: 'Paid plans' },
		{ label: 'Works without an account', scrtLink: true, competitor: true }
	],

	keyDifferences: [
		{
			title: 'Server-side encryption is a different promise',
			body: 'Password Pusher encrypts secrets at rest in its database using keys the application controls. That protects you if someone steals the database — it does not protect you from the application itself, its operators, or an attacker who reaches the running server. scrt.link never receives the key, so the same attacks yield ciphertext.'
		},
		{
			title: 'Their own FAQ makes the point for us',
			body: 'Password Pusher is candid: users of the hosted pwpush.com cannot verify that the code running there matches the published open-source code, and the project recommends self-hosting if you need that assurance. With client-side encryption the question mostly goes away — the code that touches your secret runs in your browser, where you can inspect it.'
		},
		{
			title: 'Where the paywall sits',
			body: 'On the hosted service, file uploads moved behind a paid plan (they remain free in the self-hosted edition), along with branding, audit logs and teams. scrt.link also has paid plans — but end-to-end encryption, one-time links and free file sharing are not among the things you have to pay for.'
		},
		{
			title: 'What Password Pusher does well',
			body: 'Credit where it is due: expiry by both days and views, detailed audit logs, teams with policies, enforced 2FA, 31 languages, a decade of releases. If your threat model is "stop passwords living in Slack" rather than "the provider must not be able to read this", it is a strong, mature product.'
		}
	],

	chooseScrtLink: [
		'You need the provider to be **structurally unable** to read the secret, not merely trusted.',
		'You want file sharing on the hosted service without paying for it.',
		'You want expirations shorter than a day, or links that die in 10 minutes.',
		'You want to send large files — up to 100 GB — on the same one-time links.'
	],

	chooseCompetitor: [
		'You want deep IT-admin features: audit trails, team policies, enforced 2FA, SSO.',
		'You are self-hosting anyway, which makes server-side encryption far less of a concern.',
		'You need retention up to 90 days.',
		'You want a decade-old tool with a very active release cadence and 31 languages.'
	],

	faq: [
		{
			heading: 'Is Password Pusher end-to-end encrypted?',
			body: 'No. Password Pusher encrypts secrets on the server, with keys the application holds, so the service is technically able to read them. Their own FAQ notes that hosted users cannot verify the running code and suggests self-hosting for maximum assurance. scrt.link encrypts in the browser — the key never reaches our servers.'
		},
		{
			heading: 'Is Password Pusher free?',
			body: 'The self-hosted edition is Apache-2.0 and free, including file uploads. On the hosted pwpush.com, text links are free but file sharing, branding, audit logs, teams and custom domains require a paid plan.'
		},
		{
			heading: 'Can I set how many times a link can be viewed?',
			body: 'Both tools support this. Password Pusher allows 1–100 views and 1–90 days. scrt.link allows up to 1,000 views and 10 minutes to 30 days.'
		},
		{
			heading: 'Which is better for an IT team?',
			body: 'If you need audit logs, SSO and team policies above all, Password Pusher is very strong. If the requirement is that no third party — including us — can ever read the credentials you share, scrt.link is the right architecture, and it also offers audit logs and teams on Business plans.'
		}
	]
};
