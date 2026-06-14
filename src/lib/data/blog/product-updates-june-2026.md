---
title: Product updates — June 2026
lead: Secret Requests leaves beta, a command-line interface arrives, and a batch of security and quality improvements ship.
description: scrt.link's June 2026 update graduates Secret Requests out of beta onto the Top Secret plan, introduces the scrtlink CLI, and rounds up recent security, white-label, and encryption improvements.
date: '2026-06-14'
categories:
  - product
  - privacy
published: true
---

Another month, another round of improvements. The headline this time: **Secret Requests is out of beta**, and there's now a **command-line interface** for sending secrets without leaving your terminal.

## Secret Requests is out of beta

Back in April we launched [Secret Requests](/blog/secret-requests-beta) in public beta — a way to _ask_ someone for sensitive information and receive it end-to-end encrypted, no account required on their side. Since then you've used it to collect credentials, gather client documents, and pull artifacts during incident response, and you've sent us the rough edges to fix.

It's now generally available — feature-complete and battle-tested:

- **End-to-end encrypted file attachments** — recipients can attach files to their response, encrypted in their browser before they leave it.
- **Response notifications** — you get an email the moment someone responds, with the request's expiry date included.
- **A cleaner dashboard** — the requests table shows the destruction date for each request at a glance.

During the beta, Secret Requests was free for everyone. Now that it's a finished product, it moves onto the **[Top Secret](/pricing)** plan (and **Top Secret Service** for teams). If you've been relying on it, you'll need a Top Secret subscription to keep creating new requests — existing responses remain accessible. White-label customers can continue to enable Secret Requests on their own domains.

## A command-line interface

You can now send secrets straight from your terminal — no browser, no copy-paste:

```bash
npx @scrt-link/cli "the eagle lands at midnight"
```

The `scrtlink` CLI encrypts your secret locally and returns a one-time link, the same zero-knowledge flow as the web app. It supports:

- `--expires` to set how long the link survives before it self-destructs
- `--host` to point at your own white-label domain
- `--note` to attach a note that only you, the creator, can see

It's perfect for scripts, CI pipelines, and anyone who lives in a shell. Full documentation lives on the new [CLI page](/cli), and the CLI talks to the same public API that ships with the Top Secret plan.

## More that shipped recently

A handful of smaller improvements landed over the past few weeks:

- **A dedicated [security page](/security)** — covering our zero-knowledge architecture, a `security.txt`, and a responsible-disclosure policy. We also hardened the platform with a strict Content-Security-Policy, `Referrer-Policy`, and `Permissions-Policy` headers.
- **Configurable destruction timer for Snap** — set how long a Snap secret lingers before it self-destructs, with a live countdown for the recipient.
- **Richer white-label theming** — full independent light- and dark-mode color customization for your branded instance.
- **Better-looking docs** — Markdown content now supports GFM tables and syntax-highlighted code blocks that adapt to dark mode.

---

As always, feedback is welcome — reach out via the [contact page](/contact) or open an issue on [GitHub](https://github.com/stophecom/scrt-link-v2).

Stay safe,  
Chris
