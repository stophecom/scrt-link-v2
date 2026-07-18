import type { Comparison } from './types';

export const tresoritSend: Comparison = {
	slug: 'tresorit-send',
	name: 'Tresorit Send',
	website: 'https://send.tresorit.com',
	category: 'file-transfer',
	published: true,
	lastVerified: '2026-07-14',

	title: 'scrt.link vs Tresorit Send',
	lead: 'Tresorit Send is end-to-end encrypted and free — but proprietary, files-only, and fixed at 5 GB and 7 days.',

	metaTitle: 'Tresorit Send Alternative — scrt.link vs Tresorit Send',
	metaDescription:
		'Comparing scrt.link and Tresorit Send: two end-to-end encrypted file transfer tools. Open source vs proprietary, file size, expiration, download limits and text secrets side by side.',
	metaKeywords:
		'tresorit send alternative, scrt.link vs tresorit send, end-to-end encrypted file transfer, secure large file sharing, swiss encrypted file sharing',

	summary: `[Tresorit Send](https://send.tresorit.com) is the free file-sharing arm of Tresorit, a Swiss-Hungarian encrypted-storage company with a serious compliance story. It is genuinely end-to-end encrypted: files are encrypted with AES-256 before they leave your device, and Tresorit states it does not hold the keys — they live in the link.

The limits are fixed rather than chosen: **5 GB per share, up to 100 files, 7 days, and a cap of 10 downloads**. It handles files only — no text secrets. And it is **proprietary**: Tresorit has said an open-source release and third-party audit are "on the roadmap" since 2018, and neither has arrived.

scrt.link is the open-source counterpart: MIT-licensed, self-hostable, files up to 100 GB, expiry from 10 minutes to 30 days, and text secrets alongside files.`,

	features: [
		{ label: 'End-to-end encrypted in the browser', scrtLink: true, competitor: true },
		{ label: 'Decryption key never reaches the server', scrtLink: true, competitor: true },
		{ label: 'Open source', scrtLink: 'Yes (MIT)', competitor: false },
		{ label: 'Self-hostable', scrtLink: true, competitor: false },
		{ label: 'Max file size', scrtLink: 'Up to 100 GB', competitor: '5 GB, max 100 files' },
		{ label: 'Expiration', scrtLink: '10 minutes – 30 days', competitor: '7 days (fixed)' },
		{
			label: 'Configurable view / download limit',
			scrtLink: 'Up to 1,000 views',
			competitor: '10 downloads (fixed)'
		},
		{ label: 'Password protection', scrtLink: 'Yes (paid plans)', competitor: true },
		{ label: 'Revoke a link after sending', scrtLink: true, competitor: 'Yes (admin link)' },
		{ label: 'Read receipts', scrtLink: 'Yes (paid plans)', competitor: 'Yes (admin link)' },
		{ label: 'Text secrets (passwords, keys, notes)', scrtLink: true, competitor: false },
		{ label: 'One-time redirects & file requests', scrtLink: true, competitor: false },
		{ label: 'REST API', scrtLink: true, competitor: 'None official' },
		{ label: 'Official CLI', scrtLink: 'Yes (@scrt-link/cli)', competitor: false },
		{ label: 'Browser extension', scrtLink: 'Chrome & Firefox', competitor: 'Chrome' },
		{ label: 'Custom domain / white-label', scrtLink: 'Yes (Business)', competitor: false },
		{ label: 'Works without an account', scrtLink: true, competitor: true }
	],

	keyDifferences: [
		{
			title: 'Both are end-to-end encrypted — one you can verify',
			body: 'Tresorit Send encrypts client-side with AES-256 and says the keys are stored in the link, not on their servers. We have no reason to doubt it. But the code is proprietary, and an open-source release plus a third-party audit have been promised since 2018 without materialising. With scrt.link, the encryption code is MIT-licensed and you can read it before you trust it.'
		},
		{
			title: 'Fixed limits versus chosen limits',
			body: 'Tresorit Send gives you 5 GB, 7 days and 10 downloads — no dials. That is fine when it fits and unhelpful when it does not: you cannot make a link die after one download, or in ten minutes, or keep it alive for a month. scrt.link lets you set expiry from 10 minutes to 30 days and view limits from 1 to 1,000.'
		},
		{
			title: 'Files only',
			body: 'Tresorit Send moves files. It has no text-secret feature, so the archive password or API key that goes with the file ends up in email or Slack anyway. scrt.link handles both, with the same encryption and the same self-destructing links.'
		},
		{
			title: 'What Tresorit brings that we do not',
			body: 'Tresorit is a substantial company with Swiss data residency, an established compliance posture, and a full encrypted-storage product behind Send. If you are already a Tresorit customer, or your procurement team wants that specific jurisdiction and certification story, that is a real advantage.'
		}
	],

	chooseScrtLink: [
		'You want to **audit the code** that encrypts your files, not just be told it is safe.',
		'You need more than 5 GB, or an expiry other than exactly 7 days.',
		'You want to send credentials and notes as well as files.',
		'You want an API, a CLI, your own branded domain, or the option to self-host.'
	],

	chooseCompetitor: [
		'You are already a Tresorit customer and want everything in one vendor.',
		'Swiss data residency and their compliance certifications are a procurement requirement.',
		'5 GB, 7 days and 10 downloads happen to fit your use case exactly.',
		'You want a large, established company with formal enterprise support behind the product.'
	],

	faq: [
		{
			heading: 'Is Tresorit Send really end-to-end encrypted?',
			body: 'Tresorit states that files are encrypted with AES-256 before leaving your device and that it does not hold the encryption keys — they are stored in the link itself. That is a genuine end-to-end design. The caveat is that the code is proprietary and has not been independently audited or open-sourced, despite Tresorit saying both are planned since 2018.'
		},
		{
			heading: 'What are the limits of Tresorit Send?',
			body: 'Up to 5 GB per share, a maximum of 100 files, links valid for 7 days, and a cap of 10 downloads — whichever comes first. These are fixed. scrt.link supports up to 100 GB, expiry from 10 minutes to 30 days, and view limits you set yourself.'
		},
		{
			heading: 'Is Tresorit Send free?',
			body: 'Yes, Tresorit Send is free to use without registration. Tresorit’s separate encrypted cloud storage product has paid plans.'
		},
		{
			heading: 'What is the best open-source Tresorit Send alternative?',
			body: 'scrt.link is MIT-licensed, end-to-end encrypted, self-hostable, and supports both files (up to 100 GB) and text secrets. You can read [the source on GitHub](https://github.com/stophecom/scrt-link-v2), including the code that encrypts your files in the browser.'
		}
	]
};
