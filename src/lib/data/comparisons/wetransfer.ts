import type { Comparison } from './types';

export const wetransfer: Comparison = {
	slug: 'wetransfer',
	name: 'WeTransfer',
	website: 'https://wetransfer.com',
	category: 'file-transfer',
	published: true,
	lastVerified: '2026-07-14',

	title: 'scrt.link vs WeTransfer',
	lead: 'WeTransfer is a convenient, ad-funded way to move big files. It is not end-to-end encrypted — it can read what you upload.',

	metaTitle: 'WeTransfer Alternative — scrt.link vs WeTransfer',
	metaDescription:
		'A secure, end-to-end encrypted WeTransfer alternative. scrt.link encrypts files in your browser, self-destructs links after one download, and shows no ads. Side-by-side comparison.',
	metaKeywords:
		'wetransfer alternative, secure wetransfer alternative, encrypted file transfer, send large files securely, self-destructing file link',

	summary: `[WeTransfer](https://wetransfer.com) is the default way a lot of people send big files, and it is genuinely good at that job. But it was built for convenience, not confidentiality.

WeTransfer encrypts your files **in transit (TLS) and at rest (AES-256)** — it holds the keys. That means WeTransfer can technically read your uploads, and their terms grant them a license to use your content "for the purposes of operating, developing, and improving the Service". Their free tier is funded by advertising.

scrt.link encrypts files in your browser before upload. The key lives in the URL fragment and is never sent to us, so we cannot read your file — and there is nothing to hand over, sell, or lose.

To be fair to them: WeTransfer's current terms of service contain **no AI or machine-learning training clause**. A clause added in July 2025 caused an outcry and was withdrawn within days. Their privacy policy also says advertising is never targeted on the contents of your files.`,

	features: [
		{ label: 'End-to-end encrypted in the browser', scrtLink: true, competitor: false },
		{
			label: 'Provider can technically read your files',
			scrtLink: 'No',
			competitor: 'Yes (holds the keys)'
		},
		{ label: 'Max file size', scrtLink: 'Up to 100 GB', competitor: '3 GB free, up to 1 TB paid' },
		{
			label: 'Free tier limits',
			scrtLink: 'No transfer quota',
			competitor: '10 transfers / 3 GB per 30 days'
		},
		{
			label: 'Link expiration',
			scrtLink: '10 minutes – 30 days',
			competitor: 'Up to 3 days free, custom on paid'
		},
		{ label: 'Self-destructs after being opened', scrtLink: true, competitor: false },
		{
			label: 'Configurable view / download limit',
			scrtLink: 'Up to 1,000 views',
			competitor: false
		},
		{ label: 'Password protection', scrtLink: 'Yes (paid plans)', competitor: 'Paid plans only' },
		{ label: 'Text secrets (passwords, keys, notes)', scrtLink: true, competitor: false },
		{ label: 'Ad-free', scrtLink: true, competitor: 'Free tier is ad-funded' },
		{ label: 'Open source', scrtLink: 'Yes (MIT)', competitor: false },
		{ label: 'Self-hostable', scrtLink: true, competitor: false },
		{ label: 'Public API', scrtLink: true, competitor: 'Retired in 2022' },
		{ label: 'Official CLI', scrtLink: 'Yes (@scrt-link/cli)', competitor: false },
		{
			label: 'Custom domain / white-label',
			scrtLink: 'Yes (Business)',
			competitor: 'Paid plans only'
		},
		{ label: 'Works without an account', scrtLink: true, competitor: 'Quota is tracked per user' }
	],

	keyDifferences: [
		{
			title: 'Encrypted for them, or encrypted from them',
			body: 'WeTransfer describes its security accurately: files are encrypted in transit with TLS and at rest with AES-256. What that protects against is someone stealing the disks or sniffing the wire. It does not protect against WeTransfer itself, a rogue employee, a subpoena, or an attacker who gets into the account that holds the keys. scrt.link never has the key, so none of those are attack paths.'
		},
		{
			title: 'The business model shows up in the product',
			body: 'WeTransfer\'s free tier is paid for by advertising — their privacy policy lists "serving you ads from our advertising clients" as a purpose, with a free product as the stated justification. To their credit, they say personalised ads explicitly exclude your uploaded content. scrt.link has no ads and no advertising partners; paid plans fund the product.'
		},
		{
			title: 'A download link is not a secret link',
			body: 'A WeTransfer link stays live for its whole lifetime and can be downloaded repeatedly by anyone who has it — forwarded, pasted into a ticket, or sitting in an inbox. scrt.link links are built to burn: by default the file is destroyed after the first view, and you can set an explicit view limit and expiry.'
		},
		{
			title: 'Files are only half the problem',
			body: 'The credential usually travels with the file — the archive password, the API key, the database dump login. WeTransfer has no text-secret feature at all, so that half ends up in Slack or email anyway. scrt.link handles files and text secrets in the same tool, with the same encryption.'
		}
	],

	chooseScrtLink: [
		'The file is confidential and you need the provider to be **unable** to read it.',
		'You want the link to self-destruct after it is opened, not linger for days.',
		'You are sending credentials, keys, or documents subject to NDA, GDPR or similar obligations.',
		'You want no ads, an open-source codebase you can audit, and the option to self-host.'
	],

	chooseCompetitor: [
		'You are sending large, non-sensitive files — a video cut, photo set, or design assets.',
		'Your recipients already know and trust the WeTransfer flow, and simplicity beats everything.',
		'You want a polished, mainstream product with a long track record and mobile apps.',
		'You need transfers up to 1 TB on a single link, which is beyond our largest plan.'
	],

	faq: [
		{
			heading: 'Is WeTransfer end-to-end encrypted?',
			body: 'No. WeTransfer encrypts files in transit with TLS and at rest with AES-256, but it holds the encryption keys, which means it can technically access your files. End-to-end encryption means the provider never holds the key — that is what scrt.link does, by encrypting in your browser before upload.'
		},
		{
			heading: 'Does WeTransfer train AI on my files?',
			body: 'No. In July 2025 WeTransfer briefly added terms that mentioned machine-learning training; after public backlash the clause was withdrawn within days. The current terms of service contain no AI or machine-learning language. They do retain a broad license to use content for "operating, developing, and improving the Service", and their free tier is funded by advertising — though they state ads are not targeted on your file contents.'
		},
		{
			heading: 'What is the most secure WeTransfer alternative?',
			body: 'Look for end-to-end encryption where the decryption key never reaches the server, an open-source codebase you can verify, and links that expire. scrt.link does all three: files are encrypted in the browser with the key held in the URL fragment, the code is MIT-licensed on [GitHub](https://github.com/stophecom/scrt-link-v2), and every link self-destructs.'
		},
		{
			heading: 'How large a file can scrt.link send?',
			body: 'Up to 100 GB on the Top Secret plan. Free accounts can send files up to 10 MB, and paid plans start at 1 GB. Files are encrypted in your browser before they are uploaded, at every size.'
		},
		{
			heading: 'How long does a WeTransfer link last compared to scrt.link?',
			body: 'WeTransfer free transfers are available for up to 3 days, and paid plans allow custom expiration. scrt.link links expire between 10 minutes and 30 days, and — unlike WeTransfer — are destroyed as soon as they have been opened the configured number of times.'
		}
	]
};
