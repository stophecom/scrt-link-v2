---
title: Lessons learned from rewriting react to svelte 5
lead: todo
description: Rewriting a React app to Svelte 5 was an eye-opening experience. From ditching the virtual DOM to embracing Runes, this journey taught me a lot about performance, reactivity, and developer experience. Here are the key lessons learned along the way.
date: '2023-4-16'
categories:
  - sveltekit
  - svelte
  - react
published: false
---

## Abstract

The app has been rewritten from scratch from React with next.js to Svelte 5 and SvelteKit. Since we went back to the start, we took the chance to rethink some of the decisions made. These changes include:

- Svelte instead of React
- Postgres with Drizzle instead of MongoDB with Prisma
- Resend instead of Mailjet for transactional emails
- More authentication options instead of just magic links
- Added option for expiration period
- Advanced password protection for secrets
- Dark mode
- Now up to 100GB file transfer

These changes resulted in overall

- 2x faster builds
- 100x allowed file size
- Improved web performance metrics (Lighthouse)

## Why

Scrt.link has been out there for 4 years now and it has steadily [gained traction](https://plausible.io/scrt.link?period=12mo&keybindHint=L). Despite rising usage stats and happy customers, some flaws remained. There was the file-transfer feature that never made it out of beta, a lack of alternative login methods (only supported magic links), and some code that needed refactoring. Also infrastructure and services added some complexity.
