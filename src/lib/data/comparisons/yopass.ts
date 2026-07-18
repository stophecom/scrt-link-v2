import type { Comparison } from './types';

export const yopass: Comparison = {
	slug: 'yopass',
	name: 'Yopass',
	website: 'https://yopass.se',
	category: 'secret-sharing',
	published: true,
	lastVerified: '2026-07-14',

	title: 'scrt.link vs Yopass',
	lead: 'Both are open source and genuinely end-to-end encrypted. The difference is scale, expiration, and what you get without a licence.',

	metaTitle: 'Yopass Alternative — scrt.link vs Yopass',
	metaDescription:
		'Comparing scrt.link and Yopass: two open-source, end-to-end encrypted secret sharing tools. File size, expiration, view limits, branding and licensing side by side.',
	metaKeywords:
		'yopass alternative, scrt.link vs yopass, open source secret sharing, self-hosted one-time secret, end-to-end encrypted secret link',

	summary: `[Yopass](https://yopass.se) is a good tool and we will not pretend otherwise. It encrypts with OpenPGP in the browser, the decryption key never reaches the server, and it is Apache-2.0 licensed. If you want a small Go binary to self-host, it is a strong choice.

The honest differences are practical rather than philosophical. Yopass caps uploads at **1 MB** without a paid licence and offers exactly **three expiration options — 1 hour, 1 day, 1 week**. Its branding, OIDC login, audit logs, read receipts and webhooks now sit behind a €149/year business licence.

scrt.link is a hosted product with the same zero-knowledge model: files up to 100 GB, expiration from 10 minutes to 30 days, view limits up to 1,000, and accounts and teams built in.`,

	features: [
		{ label: 'End-to-end encrypted in the browser', scrtLink: true, competitor: true },
		{ label: 'Decryption key never reaches the server', scrtLink: true, competitor: true },
		{ label: 'Open source', scrtLink: 'Yes (MIT)', competitor: 'Yes (Apache-2.0)' },
		{ label: 'Self-hostable', scrtLink: true, competitor: true },
		{
			label: 'File sharing',
			scrtLink: 'Up to 100 GB',
			competitor: '1 MB without a licence'
		},
		{
			label: 'Text secret size',
			scrtLink: 'Up to 100,000 characters',
			competitor: '10,000 characters (default)'
		},
		{
			label: 'Expiration',
			scrtLink: '10 minutes – 30 days',
			competitor: '1 hour, 1 day or 1 week'
		},
		{
			label: 'Configurable view limit',
			scrtLink: 'Up to 1,000 views',
			competitor: 'One-time on/off'
		},
		{ label: 'Password protection', scrtLink: 'Yes (paid plans)', competitor: true },
		{ label: 'Read receipts', scrtLink: 'Yes (paid plans)', competitor: 'Licence required' },
		{
			label: 'Custom branding / white-label',
			scrtLink: 'Yes (Business)',
			competitor: 'Licence required'
		},
		{ label: 'Hosted service with accounts & teams', scrtLink: true, competitor: false },
		{ label: 'File requests (receive secrets)', scrtLink: true, competitor: 'Licence required' },
		{ label: 'REST API', scrtLink: true, competitor: true },
		{ label: 'Official CLI', scrtLink: 'Yes (@scrt-link/cli)', competitor: true },
		{ label: 'Browser extension', scrtLink: 'Chrome & Firefox', competitor: 'None official' },
		{ label: 'Works without an account', scrtLink: true, competitor: true }
	],

	keyDifferences: [
		{
			title: 'The security model is the same — that is the point',
			body: 'Both tools encrypt in the browser and keep the key out of the server. Yopass uses OpenPGP, scrt.link uses AES-GCM via the Web Crypto API. If your only requirement is "the server must not be able to read this", Yopass meets it, and we would rather say so than invent a difference.'
		},
		{
			title: 'Open core, and where the line falls',
			body: 'Yopass has moved to an open-core model: a €149/year business licence gates custom branding, OpenID Connect, audit logging, read receipts, webhooks, secret requests — and lifts the 1 MB upload cap. That is a fair way to fund the work, but it means the free edition is more limited than it first appears.'
		},
		{
			title: 'Files, and how big they get',
			body: 'Without a licence Yopass caps uploads at 1 MB, which rules out most real files — a database dump, a design archive, a set of client documents. scrt.link handles files up to 100 GB, encrypted in the browser and streamed, on the same one-time links.'
		},
		{
			title: 'Expiration windows',
			body: 'Yopass offers three fixed options: 1 hour, 1 day, 1 week. That is often enough, but not when a contractor needs the credential on Monday and it is Friday, or when you want a link that dies in 10 minutes. scrt.link runs from 10 minutes up to 30 days.'
		}
	],

	chooseScrtLink: [
		'You need to send **real files**, not just a 1 MB payload.',
		'You want expiration windows shorter than an hour or longer than a week.',
		'You want branding, read receipts and file requests without buying a licence.',
		'You want a hosted service with accounts and teams rather than something to operate yourself.'
	],

	chooseCompetitor: [
		'You want to self-host a single, small Go binary and be done with it.',
		'Apache-2.0 matters to you, or you want OpenPGP specifically.',
		'You never need to send more than 1 MB, and 1h/1d/1w covers your needs.',
		'You want zero accounts anywhere in the system, by design.'
	],

	faq: [
		{
			heading: 'Is Yopass end-to-end encrypted?',
			body: 'Yes. Yopass encrypts secrets in the browser with OpenPGP and the decryption key never reaches the server. On this dimension it is equivalent to scrt.link — both are genuine zero-knowledge designs. The differences are practical: file size, expiration options, view limits, and which features need a paid licence.'
		},
		{
			heading: 'How large a file can Yopass send?',
			body: 'The Yopass server caps uploads at 1 MB unless you hold a business licence (the default is 512 KB). scrt.link supports files up to 100 GB on the Top Secret plan, with the same in-browser encryption.'
		},
		{
			heading: 'Is scrt.link free and open source like Yopass?',
			body: 'scrt.link is MIT-licensed and can be self-hosted, and you can create encrypted one-time links for free without an account. Paid plans add larger files, longer expiration, higher view limits, password protection, read receipts and white-labelling.'
		},
		{
			heading: 'Which should I self-host?',
			body: 'If you want the smallest possible thing to operate and your secrets are short text, Yopass is excellent. If you also need large files, longer expirations, accounts, teams or branding without a licence fee, scrt.link is the better fit — it is also open source and self-hostable.'
		}
	]
};
