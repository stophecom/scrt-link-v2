import type { Comparison } from './types';

export const onetimesecret: Comparison = {
	slug: 'onetimesecret',
	name: 'OneTimeSecret',
	website: 'https://onetimesecret.com',
	category: 'secret-sharing',
	published: true,
	lastVerified: '2026-07-14',

	title: 'scrt.link vs OneTimeSecret',
	lead: 'Both create self-destructing links. Only one encrypts the secret in your browser before it reaches the server.',

	metaTitle: 'OneTimeSecret Alternative — scrt.link vs OneTimeSecret',
	metaDescription:
		'Looking for a OneTimeSecret alternative? scrt.link encrypts secrets in your browser, supports files up to 100 GB and configurable view limits. Full side-by-side comparison.',
	metaKeywords:
		'onetimesecret alternative, one time secret alternative, scrt.link vs onetimesecret, secure secret sharing, end-to-end encrypted one-time link',

	summary: `[OneTimeSecret](https://onetimesecret.com) has been running since 2011 and is the tool most people find first. It is open source, well maintained, and deliberately minimal — it shares short text secrets, once.

The difference that matters is **where encryption happens**. OneTimeSecret states that "decryption keys live on the application server". Your secret arrives at their server as plaintext and is encrypted there. scrt.link encrypts in your browser first: the key lives in the part of the URL after the \`#\`, which browsers never send to a server. We cannot read your secret, even if we wanted to.

OneTimeSecret also shares text only — no files — and every link is strictly one view.`,

	features: [
		{ label: 'End-to-end encrypted in the browser', scrtLink: true, competitor: false },
		{
			label: 'Decryption key never reaches the server',
			scrtLink: true,
			competitor: 'Only with a passphrase'
		},
		{ label: 'Open source', scrtLink: 'Yes (MIT)', competitor: 'Yes (MIT)' },
		{ label: 'Self-hostable', scrtLink: true, competitor: true },
		{ label: 'File sharing', scrtLink: 'Up to 100 GB', competitor: 'Not supported' },
		{
			label: 'Text secret size',
			scrtLink: 'Up to 100,000 characters',
			competitor: '100 KB anonymous, 1 MB with account'
		},
		{ label: 'One-time (burn after reading) links', scrtLink: true, competitor: true },
		{
			label: 'Configurable view limit',
			scrtLink: 'Up to 1,000 views',
			competitor: 'One view only'
		},
		{
			label: 'Expiration',
			scrtLink: '10 minutes – 30 days',
			competitor: 'Up to 7 days anonymous, 30 days on paid plans'
		},
		{ label: 'Password protection', scrtLink: 'Yes (paid plans)', competitor: true },
		{ label: 'One-time redirects & file requests', scrtLink: true, competitor: false },
		{ label: 'REST API', scrtLink: true, competitor: true },
		{ label: 'Official CLI', scrtLink: 'Yes (@scrt-link/cli)', competitor: 'None official' },
		{
			label: 'Browser extension',
			scrtLink: 'Chrome & Firefox',
			competitor: 'None official'
		},
		{ label: 'Custom domain / white-label', scrtLink: 'Yes (Business)', competitor: true },
		{ label: 'Works without an account', scrtLink: true, competitor: true },
		{ label: 'Ad-free', scrtLink: true, competitor: true }
	],

	keyDifferences: [
		{
			title: 'Where the encryption happens',
			body: 'OneTimeSecret encrypts your secret **on their server**, using a key their application holds. That is meaningfully safer than storing plaintext, but it means the service is in a position to read your secret, and a compromise of the server is a compromise of the secrets in flight. scrt.link encrypts in the browser and puts the key in the URL fragment — the part after `#` that browsers never transmit. Their own security guidance even suggests encrypting content yourself before pasting it in, for highly sensitive data.'
		},
		{
			title: 'Passphrases change the picture — partly',
			body: "OneTimeSecret's optional passphrase is folded into the encryption key and only a hash is stored, so with a passphrase set they can no longer decrypt the secret after it is saved. It still travels to their server as plaintext at creation time, and it only helps if you remember to use it and can get the passphrase to the recipient over a second channel."
		},
		{
			title: 'Text only, versus text and files',
			body: 'OneTimeSecret shares text and nothing else — that is an explicit design decision, and their FAQ points you to a separate file transfer service if you need one. scrt.link handles both from the same place: text secrets, files up to 100 GB, one-time redirects, and secret requests where someone sends *you* something securely.'
		},
		{
			title: 'One view, versus up to a thousand',
			body: 'Every OneTimeSecret link is strictly single-view. That is the right default, but it breaks down when a link needs to reach a team, or when a recipient accidentally opens it on the wrong device. scrt.link lets you set a view limit anywhere from 1 to 1,000 on paid plans, so you can pick the trade-off yourself.'
		}
	],

	chooseScrtLink: [
		'You want the service provider to be **structurally unable** to read your secrets, not just promising not to.',
		'You need to send **files**, not only text.',
		'You want a link that can be opened more than once, or a longer expiration window.',
		'You want an official CLI, browser extensions, and a REST API in the same product.'
	],

	chooseCompetitor: [
		'You want the most established option — it has been running since 2011 and is trusted by a lot of people.',
		'You only ever share short text and value an interface with nothing else in it.',
		'You want a custom domain without paying: their free Basic tier includes one.',
		'You want to self-host something with a small, well-understood footprint (Ruby + Redis).'
	],

	faq: [
		{
			heading: 'Is OneTimeSecret end-to-end encrypted?',
			body: 'No. OneTimeSecret encrypts secrets on their server — their own site states that decryption keys live on the application server. If you set a passphrase, they store only a hash of it and can no longer decrypt the secret once saved, but the secret still reaches their server unencrypted when you create it. scrt.link encrypts in the browser, before anything is sent.'
		},
		{
			heading: 'Can OneTimeSecret share files?',
			body: 'No. It is text-only by design, and their FAQ recommends a dedicated file transfer service for files. scrt.link supports files up to 100 GB with the same end-to-end encryption as text secrets.'
		},
		{
			heading: 'Is scrt.link open source like OneTimeSecret?',
			body: 'Yes. Both are open source under the MIT license, and both can be self-hosted. You can read the scrt.link source on [GitHub](https://github.com/stophecom/scrt-link-v2) — including the encryption code that runs in your browser.'
		},
		{
			heading: 'How long can a secret live?',
			body: 'OneTimeSecret allows up to 7 days for anonymous users, 14 days with a free account, and up to 30 days on paid plans. scrt.link offers 10 minutes to 7 days, extended to 30 days on the Top Secret plan.'
		},
		{
			heading: 'Do I need an account to use scrt.link?',
			body: 'No. You can create an end-to-end encrypted, self-destructing link without signing up. An account raises the size limits and unlocks password protection, read receipts, longer expiration and higher view limits.'
		}
	]
};
