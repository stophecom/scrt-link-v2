---
title: Introducing Secret Requests (Public Beta)
lead: Ask anyone for sensitive information — passwords, credentials, documents — and receive it end-to-end encrypted.
description: Secret Requests is now in public beta on scrt.link. Generate a one-time link, share it with anyone, and receive an encrypted response that only you can read.
date: '2026-04-20'
categories:
  - product
  - privacy
published: true
---

scrt.link has always been about sending secrets. Today we're flipping the direction: **Secret Requests** let you _ask_ someone for sensitive information and receive it end-to-end encrypted — no account required on their side.

The feature is in public beta, free to use, and available to anyone with a scrt.link account.

### Who it's for

Secret Requests fit any workflow where you regularly collect sensitive data from other people and currently use email, chat, or a clunky client portal.

- **IT operations & service desk** — collect credentials during onboarding or password resets without them landing in an inbox or a Slack thread.
- **Security & incident response** — pull tokens, logs, or artifacts from affected users while you triage, without broadening the blast radius.
- **Legal** — request statements, signed documents, or account details from clients without standing up a dedicated portal.
- **Accountants & tax preparers** — gather tax IDs, bank details, and financial statements from clients each cycle.
- **Journalists** — accept tips where the _content_ of the message must stay private. One honest caveat: this is not an anonymity tool — the server still sees network-level metadata from your source. For identity-protection use SecureDrop or Tor.

### How to use it

1. Create a free scrt.link account and enable encryption (this sets up your password-derived Master Key).
2. Go to **Account → Secret Requests**, write an optional note for the recipient, and pick an expiration.
3. Share the generated link however you'd normally reach the person — email, Signal, SMS.
4. The recipient opens the link in a browser, types a response, and submits. No signup, no app install.
5. Back in your dashboard, the response decrypts in your browser as soon as you open it.

### How it works

The short version: everything sensitive is encrypted in the recipient's browser before it leaves their machine, and only your browser — unlocked by your password — can decrypt it. Our servers store ciphertext.

For readers who want specifics:

- **Requester key pair**: your browser generates an **RSA-2048 (OAEP, SHA-256)** key pair when you create your first request. The public key is uploaded to the server. The private key is **wrapped with your Master Key (AES-256-GCM)** before it leaves the browser.
- **Master Key**: derived from your password via **PBKDF2-SHA256, 600 000 iterations**. It never reaches the server. If you forget your password, we cannot recover your data — that's the tradeoff for zero-knowledge.
- **Response encryption**: the recipient's browser generates a fresh **AES-256-GCM** key per response, encrypts the response content with it, and then wraps that AES key with your RSA public key (**RSA-OAEP**). The server stores only the ciphertext plus the wrapped key.
- **The note you attach** for the recipient is encrypted with an ephemeral AES key placed in the URL's **hash fragment** (`#…`). Hash fragments never travel to the server, so the note stays zero-knowledge end-to-end.
- **Decryption path** on your side: Master Key → unwrap the RSA private key → unwrap the response's AES key → decrypt the response. All steps happen locally.

What this means in plain terms: a database breach, a hostile host, or a subpoena against us still won't reveal response content — the server simply doesn't hold the keys.

### Free during beta — and we want your feedback

Secret Requests is feature-complete and available to every scrt.link user at no cost. "Beta" means we're watching how people actually use it and want to hear about rough edges before we declare it generally available.

If you've been looking for a cleaner way to collect sensitive information from clients, colleagues, or strangers, [create a free account](/signup) and try it. Bug reports, feature requests, and war stories welcome via the [contact form](/contact).
