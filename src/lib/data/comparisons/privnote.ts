import type { Comparison } from './types';

export const privnote: Comparison = {
	slug: 'privnote',
	name: 'Privnote',
	website: 'https://privnote.com',
	category: 'secret-sharing',
	published: true,
	lastVerified: '2026-07-14',

	title: 'scrt.link vs Privnote',
	lead: 'Privnote encrypts in the browser too — but it is closed source, ad-funded, and you cannot check any of it.',

	metaTitle: 'Privnote Alternative — scrt.link vs Privnote',
	metaDescription:
		'Looking for a Privnote alternative? scrt.link is open source, ad-free, and end-to-end encrypted, with file sharing and configurable expiration. Full side-by-side comparison.',
	metaKeywords:
		'privnote alternative, private note alternative, scrt.link vs privnote, self-destructing note, encrypted note sharing',

	summary: `[Privnote](https://privnote.com) is one of the oldest self-destructing note services, and — credit where it is due — it does encrypt your note in the browser rather than on the server.

The problem is that you have to take that on faith. Privnote is **closed source**, so nobody outside the company can verify what the JavaScript served to your browser actually does on any given day. Its free service is funded by advertising: the page loads Google AdSense and an ad-consent dialog that cites hundreds of advertising partners.

scrt.link does the same client-side encryption, but the code is [MIT-licensed on GitHub](https://github.com/stophecom/scrt-link-v2), there are no ads and no advertising partners, and you can send files as well as text.`,

	features: [
		{ label: 'Encrypted in the browser', scrtLink: true, competitor: true },
		{
			label: 'Open source (you can verify the crypto)',
			scrtLink: 'Yes (MIT)',
			competitor: false
		},
		{ label: 'Self-hostable', scrtLink: true, competitor: false },
		{ label: 'Ad-free', scrtLink: true, competitor: 'Ad-funded (AdSense)' },
		{ label: 'File sharing', scrtLink: 'Up to 100 GB', competitor: 'Not supported' },
		{
			label: 'Expiration',
			scrtLink: '10 minutes – 30 days',
			competitor: 'After reading, 1h, 24h, 7 days, 30 days'
		},
		{
			label: 'Configurable view limit',
			scrtLink: 'Up to 1,000 views',
			competitor: 'One-time, or unlimited until expiry'
		},
		{ label: 'Password protection', scrtLink: 'Yes (paid plans)', competitor: true },
		{ label: 'Read receipts', scrtLink: 'Yes (paid plans)', competitor: 'Yes (email)' },
		{ label: 'One-time redirects & file requests', scrtLink: true, competitor: false },
		{ label: 'REST API', scrtLink: true, competitor: 'None official' },
		{ label: 'Official CLI', scrtLink: 'Yes (@scrt-link/cli)', competitor: 'None official' },
		{ label: 'Browser extension', scrtLink: 'Chrome & Firefox', competitor: 'None official' },
		{ label: 'Custom domain / white-label', scrtLink: 'Yes (Business)', competitor: false },
		{ label: 'Works without an account', scrtLink: true, competitor: true }
	],

	keyDifferences: [
		{
			title: 'Client-side encryption you can actually check',
			body: 'Privnote encrypts notes in the browser — that much is visible in the JavaScript it serves. But because the product is closed source, there is no way to audit it, no published build, and no guarantee the code served tomorrow is the code served today. End-to-end encryption is a claim you should be able to verify; with scrt.link you can read every line that touches your secret.'
		},
		{
			title: 'You are the product, or you are the customer',
			body: 'Privnote is free because it sells advertising: the page loads Google AdSense and a consent dialog listing hundreds of ad partners. That is a legitimate business model, but it puts an advertising stack on the same page as your password. scrt.link carries no ads, no trackers and no ad partners — paid plans fund it.'
		},
		{
			title: 'Beware the copycats',
			body: 'Because Privnote is popular and its links look generic, it has attracted a long-running ecosystem of phishing clones on look-alike domains — KrebsOnSecurity documented one that silently rewrote bitcoin addresses inside notes. To be clear, these impersonate Privnote rather than compromise it. Still, it is a reason to prefer a service where the sending domain is one you control (scrt.link supports your own custom domain on Business plans).'
		},
		{
			title: 'Text notes only',
			body: 'Privnote shares text and nothing else. scrt.link handles text secrets, files up to 100 GB, one-time redirects and secret requests, all with the same in-browser encryption.'
		}
	],

	chooseScrtLink: [
		'You want to **verify** the encryption rather than trust a closed-source script.',
		'You do not want an advertising stack loaded on the page holding your secret.',
		'You need to send files, or share via API, CLI or a browser extension.',
		'You want links on your own domain and branding.'
	],

	chooseCompetitor: [
		'You want the absolute simplest thing that exists — one box, one link, no options.',
		'You want an email notification when a note is read, without paying for a plan.',
		'You need a note that stays readable for a fixed window rather than burning on first read.',
		'It is not sensitive enough for the open-source question to matter to you.'
	],

	faq: [
		{
			heading: 'Is Privnote actually encrypted?',
			body: 'Privnote does encrypt notes in the browser using AES — you can see it in the JavaScript it serves. The limitation is verification: Privnote is closed source, so no independent party can confirm what that code does, or that it stays the same over time. scrt.link performs the same kind of in-browser encryption with an [open-source codebase](https://github.com/stophecom/scrt-link-v2) anyone can audit.'
		},
		{
			heading: 'Is Privnote safe to use?',
			body: 'For low-stakes notes, it works as advertised. Two things are worth knowing: the free service is funded by advertising, so an ad stack loads alongside your note; and Privnote has long been targeted by phishing clones on look-alike domains, which impersonate it to steal the content of notes. Always check the domain you are on.'
		},
		{
			heading: 'Can Privnote share files?',
			body: 'No. Privnote is text-only. scrt.link supports files up to 100 GB, encrypted in your browser before upload.'
		},
		{
			heading: 'What is the best open-source Privnote alternative?',
			body: 'scrt.link is MIT-licensed, end-to-end encrypted, ad-free, and can be self-hosted. If you would rather run a pure pastebin yourself, PrivateBin is another good open-source option — we compare against it too.'
		}
	]
};
