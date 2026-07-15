import type { Comparison } from './types';

export const privatebin: Comparison = {
	slug: 'privatebin',
	name: 'PrivateBin',
	website: 'https://privatebin.info',
	category: 'secret-sharing',
	published: true,
	lastVerified: '2026-07-14',

	title: 'scrt.link vs PrivateBin',
	lead: 'PrivateBin is an excellent zero-knowledge pastebin — if you are willing to run a server. scrt.link is the hosted equivalent.',

	metaTitle: 'PrivateBin Alternative — scrt.link vs PrivateBin',
	metaDescription:
		'Comparing scrt.link and PrivateBin: two zero-knowledge, open-source tools. Hosted service vs self-hosted pastebin, file sharing, expiration and burn-after-reading side by side.',
	metaKeywords:
		'privatebin alternative, scrt.link vs privatebin, zero knowledge pastebin, self-hosted encrypted paste, burn after reading',

	summary: `[PrivateBin](https://privatebin.info) is a zero-knowledge pastebin: data is encrypted in the browser with AES-256-GCM and the key lives in the URL fragment, so the server genuinely cannot read it. It is open source, actively maintained, and refreshingly honest about its own threat model.

The catch is that **PrivateBin is software, not a service**. There is no official hosted instance — you either run it yourself (PHP plus storage) or trust a stranger's public instance, which puts you back where you started. File upload is off by default, and it is a pastebin, so links stay readable until they expire unless you tick "burn after reading".

scrt.link is the same zero-knowledge idea delivered as a product: nothing to operate, one-time by default, files up to 100 GB, accounts and teams when you need them.`,

	features: [
		{ label: 'End-to-end encrypted in the browser', scrtLink: true, competitor: true },
		{ label: 'Decryption key never reaches the server', scrtLink: true, competitor: true },
		{ label: 'Open source', scrtLink: 'Yes (MIT)', competitor: 'Yes (Zlib)' },
		{ label: 'Self-hostable', scrtLink: true, competitor: true },
		{
			label: 'Official hosted service',
			scrtLink: true,
			competitor: 'None — self-host or use a third-party instance'
		},
		{
			label: 'One-time (burn after reading) by default',
			scrtLink: true,
			competitor: 'Opt-in per paste'
		},
		{
			label: 'File sharing',
			scrtLink: 'Up to 100 GB',
			competitor: 'Disabled by default, ~10 MB limit'
		},
		{
			label: 'Expiration',
			scrtLink: '10 minutes – 30 days',
			competitor: '5 minutes – 1 year, or never'
		},
		{ label: 'Configurable view limit', scrtLink: 'Up to 1,000 views', competitor: false },
		{ label: 'Password protection', scrtLink: 'Yes (paid plans)', competitor: true },
		{ label: 'Read receipts', scrtLink: 'Yes (paid plans)', competitor: false },
		{ label: 'Accounts & teams', scrtLink: true, competitor: false },
		{ label: 'One-time redirects & file requests', scrtLink: true, competitor: false },
		{ label: 'Official CLI', scrtLink: 'Yes (@scrt-link/cli)', competitor: 'None official' },
		{ label: 'Browser extension', scrtLink: 'Chrome & Firefox', competitor: 'None official' },
		{ label: 'Custom domain / white-label', scrtLink: 'Yes (Business)', competitor: 'Self-hosted' }
	],

	keyDifferences: [
		{
			title: 'A product versus a project',
			body: 'PrivateBin deliberately ships no official hosted instance. That is philosophically clean, but in practice it means someone on your team has to run PHP, storage and updates forever — or you paste your secrets into a public instance run by a person you have never met, which defeats the purpose. scrt.link is a hosted service with the same zero-knowledge guarantees, and it can still be self-hosted if you want.'
		},
		{
			title: 'Pastebin semantics, not one-time semantics',
			body: 'A PrivateBin paste is readable until it expires — potentially for a year, or never. "Burn after reading" exists but is opt-in, one checkbox among several. scrt.link inverts that: links are one-time by default and you raise the limit deliberately, up to 1,000 views.'
		},
		{
			title: 'Files are an afterthought',
			body: 'PrivateBin supports file upload, but it is disabled by default and bounded by a size limit of roughly 10 MB in the sample configuration. Public instances vary wildly. scrt.link treats files as a first-class case: up to 100 GB, encrypted in the browser, streamed to storage.'
		},
		{
			title: 'They are honest about the limits, and so are we',
			body: 'PrivateBin states plainly that a malicious or compromised server operator could inject JavaScript that leaks the key, and that access logs can reveal who read a paste. That is true of every browser-based zero-knowledge tool, scrt.link included. It is the reason both projects are open source and the reason self-hosting exists.'
		}
	],

	chooseScrtLink: [
		'You want zero-knowledge secret sharing **without operating a server**.',
		'You want one-time links by default, not pastes that linger.',
		'You need real file sizes, accounts, teams, or an API and CLI.',
		'You want the link to live on your own branded domain.'
	],

	chooseCompetitor: [
		'You are happy to self-host, and you want the smallest, most auditable thing you can run.',
		'You want a genuine pastebin — syntax highlighting, comments, discussion on a paste.',
		'You need very long retention (up to a year, or never expiring).',
		'You want a project with no company attached to it at all.'
	],

	faq: [
		{
			heading: 'Is PrivateBin secure?',
			body: 'Yes — PrivateBin is a well-regarded zero-knowledge design. Data is encrypted in the browser with AES-256-GCM and the key sits in the URL fragment, which is never sent to the server. Its own documentation is candid that a compromised server operator could still serve malicious JavaScript; that risk applies to every in-browser encryption tool, including scrt.link, and is why both are open source.'
		},
		{
			heading: 'Is there an official PrivateBin hosted service?',
			body: 'No. PrivateBin is software you host yourself. There is a directory of third-party public instances, but using one means trusting whoever operates it. scrt.link offers a hosted service with the same encryption model, and is also self-hostable.'
		},
		{
			heading: 'Can PrivateBin share files?',
			body: 'It can, but file upload is disabled by default and the sample configuration limits size to roughly 10 MB. scrt.link supports files up to 100 GB out of the box.'
		},
		{
			heading: 'Does PrivateBin do burn-after-reading?',
			body: 'Yes, as an option you tick when creating a paste. By default a paste stays readable until it expires. scrt.link is one-time by default, and you raise the view limit only if you want to.'
		}
	]
};
