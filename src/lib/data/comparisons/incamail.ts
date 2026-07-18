import type { Comparison } from './types';

export const incamail: Comparison = {
	slug: 'incamail',
	name: 'IncaMail',
	website: 'https://web.incamail.com',
	category: 'secure-email',
	published: true,
	lastVerified: '2026-07-18',

	title: 'scrt.link vs IncaMail',
	lead: "IncaMail is Swiss Post's service for legally-valid, registered email delivery. scrt.link is zero-knowledge secret sharing — a different tool for a different job.",

	metaTitle: 'IncaMail Alternative — scrt.link vs IncaMail',
	metaDescription:
		"How scrt.link compares to Swiss Post's IncaMail: zero-knowledge, self-destructing secret sharing vs compliant registered email delivery. Encryption model, files, pricing side by side.",
	metaKeywords:
		'incamail alternative, scrt.link vs incamail, swiss post secure email alternative, zero-knowledge secure email, secure email sharing switzerland',

	summary: `[IncaMail](https://web.incamail.com) is Swiss Post's secure email service. Its purpose is **compliant, verifiable, registered email delivery** — payslips, tax notices, insurance documents, and legally-valid correspondence for Swiss court, debt-collection and administrative proceedings. It is ISO/IEC 27001-certified and recognised by the Swiss Federal Department of Justice and Police as a secure delivery platform.

It is genuinely good at that job, and it is not really the same kind of tool as scrt.link. The two overlap only on "send something confidential to someone" — beyond that they diverge.

The core difference is the trust model. IncaMail is **platform encryption operated by a trusted party**: messages travel over TLS, are encrypted at rest, and Swiss Post runs the platform that decrypts and delivers them through a portal. scrt.link is **zero-knowledge**: the secret is encrypted in your browser and the key lives in the URL fragment, so our server never holds it. Neither is "more secure" in the abstract — they answer different questions. IncaMail answers "can I prove I legally delivered this?"; scrt.link answers "can I share this so that not even the provider can read it?"`,

	features: [
		{ label: 'Zero-knowledge / end-to-end encrypted', scrtLink: true, competitor: false },
		{
			label: 'Provider can technically access content',
			scrtLink: 'No',
			competitor: 'Yes (trusted operator)'
		},
		{
			label: 'Encryption model',
			scrtLink: 'Client-side (key in URL fragment)',
			competitor: 'Platform (TLS + encrypted at rest)'
		},
		{
			label: 'Legally-valid registered delivery',
			scrtLink: false,
			competitor: 'Yes (Swiss FDJP / SR 272.11)'
		},
		{
			label: 'Signed proof-of-delivery receipt',
			scrtLink: false,
			competitor: 'Yes (digitally signed PDF)'
		},
		{ label: 'Read receipts', scrtLink: 'Yes (paid plans)', competitor: 'Yes (legally signed)' },
		{ label: 'Self-destructing / one-time links', scrtLink: true, competitor: false },
		{
			label: 'Recipient needs no account',
			scrtLink: true,
			competitor: 'Opens via password or key link'
		},
		{ label: 'File sharing', scrtLink: 'Up to 100 GB', competitor: 'Up to 1 GB, 7-day link' },
		{
			label: 'Text secrets (passwords, keys, notes)',
			scrtLink: true,
			competitor: 'Email messages'
		},
		{
			label: 'Sends from Outlook / Office 365 / SAP',
			scrtLink: false,
			competitor: true
		},
		{
			label: 'Bulk sending from business software',
			scrtLink: false,
			competitor: 'Yes (payslips, tax notices)'
		},
		{ label: 'ISO/IEC 27001 certified', scrtLink: false, competitor: true },
		{ label: 'Open source', scrtLink: 'Yes (MIT)', competitor: false },
		{ label: 'Self-hostable', scrtLink: true, competitor: false },
		{
			label: 'Pricing',
			scrtLink: 'Free + paid plans',
			competitor: 'Free tier; Premium CHF 99/yr; Business on request'
		}
	],

	keyDifferences: [
		{
			title: 'Two different jobs, not two versions of one',
			body: 'IncaMail exists to deliver email that is compliant and provable — a signed receipt, an audit trail, recognition under Swiss law. scrt.link exists to share a secret that then disappears, with the least possible trace. If you need to send a payslip to 5,000 employees from your HR system, IncaMail is built for that and scrt.link is not. If you need to hand a contractor a database password that self-destructs after one view, scrt.link is built for that and IncaMail is not.'
		},
		{
			title: 'Trusted operator versus zero-knowledge',
			body: "IncaMail's encryption is real and its ISO 27001 certification is real — but it is platform encryption: Swiss Post runs the service, holds the keys, and decrypts messages to deliver them through its portal. You are trusting Swiss Post, which for a Swiss institution is often exactly the right thing to do. scrt.link removes that trust requirement entirely: the key is generated in your browser and never sent to us, so there is nothing on our side to read, subpoena, or leak."
		},
		{
			title: 'Proof of delivery versus no paper trail',
			body: "IncaMail's flagship feature is the legally-signed delivery receipt — evidence that a message was sent, and accepted, refused or expired. scrt.link is the opposite by design: no account needed, the link burns after reading, and we keep as little as possible. One is built to create a record; the other is built to avoid one."
		},
		{
			title: 'What the recipient has to do',
			body: 'To read an IncaMail message the recipient engages the platform — a "Read" button, then an IncaMail password or a key link (historically an app was required on iPhone). With scrt.link the recipient just opens a link and the secret decrypts in their browser. For internal, compliant correspondence the portal step is acceptable; for a quick one-off share it is friction.'
		}
	],

	chooseScrtLink: [
		'You want the provider to be **structurally unable** to read the content, not a trusted operator that can.',
		'You are sharing ad-hoc secrets — a password, an API key, a file — not sending compliant business mail.',
		"Your recipient shouldn't need an account, app, or portal login — just a link.",
		'You want it free, open source, self-hostable, and able to send files up to 100 GB.'
	],

	chooseCompetitor: [
		'You need **legally-valid registered email** with a signed proof of delivery for Swiss court, debt-collection or administrative proceedings.',
		'You send confidential documents in bulk from business software — payslips, tax notices, insurance statements.',
		'Swiss Post as a named, ISO 27001-certified operator with Swiss data residency is a compliance requirement.',
		'You want encryption built into everyday email in Outlook, Office 365 or SAP, not a separate link.'
	],

	faq: [
		{
			heading: 'Is IncaMail end-to-end encrypted?',
			body: 'Not in the zero-knowledge sense. IncaMail uses platform encryption — TLS in transit, encryption at rest — and Swiss Post operates the platform that decrypts messages to deliver them through its portal, so it can technically access content. It is ISO/IEC 27001-certified and legally recognised in Switzerland, so it is secure and compliant; it is simply a different model from scrt.link, where the key is generated in your browser and the server never holds it.'
		},
		{
			heading: 'What is the difference between IncaMail and scrt.link?',
			body: 'They solve different problems. IncaMail is compliant, verifiable, registered email delivery — its point is a signed, legally-valid proof of delivery, and it integrates with Outlook and business software for things like payslips and court documents. scrt.link is zero-knowledge secret sharing: a one-time link that self-destructs, needs no account for the recipient, and is designed to leave as little trace as possible.'
		},
		{
			heading: 'Can I send files with IncaMail?',
			body: 'Yes — IncaMail Large File Transfer handles files up to 1 GB, stored encrypted for up to 7 days before deletion. scrt.link supports files up to 100 GB, encrypted in your browser before upload, on self-destructing links.'
		},
		{
			heading: 'Is scrt.link an IncaMail alternative?',
			body: 'For ad-hoc confidential sharing, yes — especially when you want zero-knowledge encryption, no recipient account, and links that self-destruct. For legally-registered email delivery within Switzerland, IncaMail does something scrt.link deliberately does not: it produces a signed, court-recognised proof of delivery. Pick the tool that matches the job.'
		},
		{
			heading: 'Does IncaMail require an account?',
			body: 'The sender needs an IncaMail account. The recipient reads a message through the IncaMail platform using a password or a "key link"; a free Basic account enables receiving. scrt.link needs no account on either side to share an encrypted, self-destructing secret link.'
		}
	]
};
