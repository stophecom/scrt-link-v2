---
title: Product updates — July 2026
lead: Multiple files per secret, API keys for organizations, deeper white-label customization, and a browser extension for Chrome, Firefox and Edge.
description: scrt.link's July 2026 update adds multi-file secrets, organization-level API keys, per-page white-label texts, a cross-browser extension, and a Data Processing Agreement generator.
date: '2026-07-29'
categories:
  - product
  - privacy
published: true
---

Busy month. The headline: a secret can now carry **more than one file**. Organizations get their **own API keys**, white-label customers get **more of the interface to customize**, and there's a **browser extension** for Chrome, Firefox and Edge.

## Multiple files per secret

Before it was one file per secret, now you can drop multiple files into the same secret:

- **Per-file progress** while everything encrypts and uploads, with an "add more" control and a remove button on each row
- **One link** for the whole set — same one-time, self-destructing behaviour as before
- **Per-file download** on reveal, plus a **download all** button when there's more than one

Secret request attachments got the same treatment: whoever responds to your request can now attach several files at once, each encrypted in their browser before it leaves.

## API keys for organizations

API keys used to be personal. If the person who created the key downgraded, left the team, or simply went on holiday, that was your integration's problem.

Organization owners and admins can now create and revoke keys from a new **API Keys tab** on the organization, and those keys behave like team infrastructure:

- **Limits come from the organization's plan**, not the creator's — a key keeps working as configured even if the person who made it changes their own subscription or leaves
- **Scoped to your white-label domain** — requests must send an `X-Host` matching a white-label site your organization owns, and are rejected otherwise

Organization keys require **Top Secret Service**, the org plan that includes API access. Personal keys are unchanged and stay on your own API page.

## More white-label customization

The white-label editor previously let you customize your home page. It now covers the two pages your recipients actually land on:

- **Secret reception page** (`/s`) — the page someone opens when you send them a secret
- **Secret request page** (`/r`) — the page someone fills in when you ask them for one

Each gets its own title and lead text, editable per locale, with a **Home / Reception / Request switcher** above the live preview so you can see exactly what your recipients will see before you save.

## A browser extension

There's now a scrt.link extension for **[Chrome](https://chromewebstore.google.com/detail/scrtlink-%E2%80%94-share-a-secret/ljcmmhacpghmooiojfdiekokhefopmmh)**, **[Firefox](https://addons.mozilla.org/en-US/firefox/addon/scrt-link-share-a-secret/)** and **[Edge](https://microsoftedge.microsoft.com/addons/detail/scrtlink-%E2%80%94-share-a-secre/eaehlboohgmeoflgdnkeigdogefihlbj)** — all three linked from the Integrations menu in the footer.

It's a one-click way to create an encrypted, one-time link without opening a tab: authenticate once with a personal API key, then create secrets from the toolbar. All the crypto still happens in your browser, using the same `@scrt-link/client` module and the same public API as everything else. No backend involved that wasn't already.

## Data Processing Agreement generator

If your legal team has been asking for a signed DPA, you can now generate one yourself:

- Fill in your company details, **preview the agreement live**, export a signature-ready PDF
- Dual-compliant with **GDPR Art. 28** and the **Swiss revFADP Art. 9**, with a zero-knowledge clause, technical and organizational measures that reflect the actual cryptography, and a sub-processor annex
- Available publicly at **[/dpa](/dpa)**, or prefilled with your details from your organization's settings

## More that shipped

- **Change your email address** — password-based accounts can now do this from account settings, with a confirmation step.
- **[Comparison pages](/alternatives)** — nine head-to-head write-ups covering the secret-sharing and file-transfer tools people ask us about most.
- **A reworked [business page](/business)**, now leading with white-label customization.

---

As always, feedback is welcome — reach out via the [contact page](/contact) or open an issue on [GitHub](https://github.com/stophecom/scrt-link-v2).

Stay safe,  
Chris
