import type { Comparison } from './types';

export const firefoxSend: Comparison = {
	slug: 'firefox-send',
	name: 'Firefox Send',
	website: 'https://github.com/timvisee/send',
	category: 'file-transfer',
	published: true,
	lastVerified: '2026-07-14',

	title: 'scrt.link vs Firefox Send',
	lead: 'Firefox Send was shut down by Mozilla in 2020. scrt.link is built on the same idea — and it is still here.',

	metaTitle: 'Firefox Send Alternative — scrt.link vs Firefox Send',
	metaDescription:
		'Firefox Send was discontinued in 2020. scrt.link is a maintained alternative: end-to-end encrypted file sharing with a key that never leaves your browser, configurable expiry and download limits.',
	metaKeywords:
		'firefox send alternative, firefox send replacement, firefox send shut down, encrypted file sharing, send files securely, self-destructing file link',

	summary: `**Firefox Send is gone.** Mozilla suspended it on 7 July 2020 and shut it down permanently on 17 September 2020, after — in Mozilla's words — "some abusive users were beginning to use Send to ship malware and conduct spear phishing attacks". The team declined to relaunch it while refocusing the company's portfolio.

It was a genuinely great product: end-to-end encrypted in the browser, the key held in the URL fragment, and — its signature feature — **both the expiry time and the download count were yours to set**.

scrt.link is built on exactly that model, and it is actively maintained. Files are encrypted in your browser, the key never reaches our servers, and you choose how long a link lives and how many times it can be opened. If you would rather run Send yourself, the community fork at [timvisee/send](https://github.com/timvisee/send) keeps the original alive and is worth your time.`,

	features: [
		{ label: 'Still operating', scrtLink: true, competitor: 'Shut down in September 2020' },
		{ label: 'End-to-end encrypted in the browser', scrtLink: true, competitor: true },
		{ label: 'Decryption key never reaches the server', scrtLink: true, competitor: true },
		{ label: 'Open source', scrtLink: 'Yes (MIT)', competitor: 'Yes (MPL-2.0)' },
		{ label: 'Self-hostable', scrtLink: true, competitor: 'Via the community fork' },
		{
			label: 'Max file size',
			scrtLink: 'Up to 100 GB',
			competitor: '1 GB, or 2.5 GB signed in'
		},
		{
			label: 'Configurable expiration',
			scrtLink: '10 minutes – 30 days',
			competitor: true
		},
		{ label: 'Configurable download limit', scrtLink: 'Up to 1,000 views', competitor: true },
		{ label: 'Password protection', scrtLink: 'Yes (paid plans)', competitor: true },
		{ label: 'Text secrets (passwords, keys, notes)', scrtLink: true, competitor: false },
		{ label: 'REST API', scrtLink: true, competitor: false },
		{ label: 'Official CLI', scrtLink: 'Yes (@scrt-link/cli)', competitor: 'ffsend (community)' },
		{ label: 'Browser extension', scrtLink: 'Chrome & Firefox', competitor: false },
		{ label: 'Accounts, teams & audit logs', scrtLink: true, competitor: false },
		{ label: 'Custom domain / white-label', scrtLink: 'Yes (Business)', competitor: false },
		{ label: 'Commercial support / SLA', scrtLink: true, competitor: false }
	],

	keyDifferences: [
		{
			title: 'What actually happened to Firefox Send',
			body: 'Mozilla took Send offline in July 2020 after it was abused to distribute malware and host phishing payloads — the anonymity and legitimacy of a mozilla.org link made it attractive to attackers. In September 2020, amid a wider restructuring, Mozilla announced Send would not return. The code remains MPL-2.0 and lives on in forks.'
		},
		{
			title: 'The same design, still maintained',
			body: 'Send encrypted files in the browser and put the key in the URL fragment, so Mozilla never saw the contents. scrt.link uses the same approach with AES-GCM, and it is a maintained product with a company behind it — which is precisely what Send turned out not to have.'
		},
		{
			title: "Send's best feature, kept",
			body: 'Setting both an expiry and a download count was what made Send feel safe: a link that dies after one download and one hour is a very different object from a link that sits in an inbox forever. scrt.link keeps that — expiry from 10 minutes to 30 days, view limits from 1 to 1,000 — and adds text secrets, so the file and the password it needs can travel the same way.'
		},
		{
			title: 'If you want to run it yourself',
			body: 'The community fork at [timvisee/send](https://github.com/timvisee/send) is the real continuation of the project — MPL-2.0, Docker-deployable, with a public instance at send.vis.ee. Worth knowing: that instance is funded and run by one person as a volunteer effort, with a documented wind-down plan, so treat it as a community service rather than infrastructure to depend on.'
		}
	],

	chooseScrtLink: [
		'You want the Firefox Send model as a **maintained product**, not a dead one.',
		'You need files larger than 2.5 GB — up to 100 GB.',
		'You also need to send passwords, keys and notes, not just files.',
		'You want accounts, teams, an API, a CLI and someone to email when it breaks.'
	],
	chooseCompetitorTitle: 'Choose the Send community fork if…',
	chooseCompetitor: [
		'You want to self-host the original Firefox Send codebase, unchanged in spirit.',
		'MPL-2.0 and a volunteer-run project are exactly what you are looking for.',
		'You only send files, never text secrets, and 2.5 GB is plenty.',
		'You are comfortable operating and updating it yourself.'
	],

	faq: [
		{
			heading: 'Why was Firefox Send discontinued?',
			body: 'Mozilla suspended Firefox Send on 7 July 2020 because it was being abused to distribute malware and run spear-phishing campaigns. On 17 September 2020, as part of a broader refocusing of its product portfolio after layoffs, Mozilla announced the service would be shut down permanently rather than relaunched.'
		},
		{
			heading: 'What is the best Firefox Send alternative?',
			body: 'Look for the properties that made Send good: end-to-end encryption with the key in the URL fragment, a configurable expiry, and a configurable download limit. scrt.link has all three, is open source, and is actively maintained. If you would rather self-host, the [timvisee/send](https://github.com/timvisee/send) fork keeps the original codebase alive.'
		},
		{
			heading: 'Is Firefox Send coming back?',
			body: 'Not from Mozilla. The service was permanently shut down in September 2020 and Mozilla has not announced any plan to revive it. The code lives on only through community forks.'
		},
		{
			heading: 'Can I still self-host Firefox Send?',
			body: 'Yes — the maintained community fork at [timvisee/send](https://github.com/timvisee/send) is MPL-2.0 and can be deployed with Docker. Note that public instances of it are volunteer-run and not backed by any SLA.'
		},
		{
			heading: 'How large a file can scrt.link send?',
			body: 'Up to 100 GB on the Top Secret plan — well beyond the 2.5 GB ceiling Firefox Send had. Files are encrypted in your browser before upload, at every size.'
		}
	]
};
