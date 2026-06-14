---
title: Product updates — May 2026
lead: Configurable view limits, a new visual identity, and a more balanced dark mode.
description: scrt.link's May 2026 update brings configurable secret view limits, a refreshed logo and trust-focused color palette, and improved dark mode across all themes.
date: '2026-05-09'
categories:
  - product
  - design
published: true
---

A handful of improvements shipped this month — some visible, some under the hood. Here's what changed.

## Secrets can now be viewed more than once

Until now, every secret link was strictly one-time. That's still the default — and the most secure option — but it's no longer the only option.

You can now set a **view limit of up to 1,000** when creating a secret. The link will self-destruct automatically once that limit is reached. This is useful for:

- Onboarding flows where multiple people need the same credential before it's rotated
- Sharing a document with a small, defined group without losing end-to-end encryption
- Internal handoffs where you want a short window of access, not a permanent link

The secret detail page also shows **how many views remain** before the link expires, so the recipient always knows where they stand.

As always, the secret is permanently deleted the moment the last view is consumed. No residue.

## New logo and a trust-focused color palette

The visual identity has been refreshed. The new logo is cleaner and works better across all contexts — light, dark, small, large.

More importantly, the **default color palette has shifted toward trust**:

- **Navy** replaces the previous pink as the primary brand color — more serious, more professional
- **Cream** replaces pure white as the surface color — warmer, less sterile
- **Red** is used as an accent on the homepage headline animation, drawing attention without alarming

The goal was a look that feels appropriate for something handling passwords and sensitive files — confident and calm rather than playful.

If you preferred the old pink, you can switch back at any time in [Account → Settings](/account/settings).

## Better balanced dark mode across all themes

Dark mode has been improved across all five theme options. The previous implementation used the same color values in both light and dark mode, which caused contrast issues — especially for themes with bright primary colors like teal or blue.

Each theme now has a dedicated dark variant with independently tuned values:

- Primary colors in dark mode are lighter and more vibrant where needed
- **Text on colored buttons is always legible** — WCAG AA contrast verified for every combination
- Accent colors are chosen to harmonize with the primary rather than simply repeating it (blue gets an orange accent, teal gets warm orange, purple gets amber)

If you've been using dark mode and noticed buttons that were hard to read, this update fixes that.

---

As always, feedback is welcome — reach out via the [contact page](/contact) or open an issue on [GitHub](https://github.com/stophecom/scrt-link-v2).

Stay safe,  
Chris
