---
title: From React to Svelte - Lessons learned
lead: What I learned from rewriting scrt.link from React 18 to Svelte 5
description: Rewriting a React app to Svelte 5 was an eye-opening experience. From ditching the virtual DOM to embracing Runes, this journey taught me a lot about performance, reactivity, and developer experience. Here are the key lessons learned along the way.
date: '2025-03-29'
categories:
  - sveltekit
  - svelte
  - react
published: false
---

## Abstract

### Rebuilding scrt.link in Svelte 5 Runes Mode: Why We Switched from React

Rewriting a production web app from one framework to another is never a small decision. But for **scrt.link**, our secure link-sharing platform, it was the right time for a reboot — not just in terms of performance, but also developer experience, simplicity, and potential for future growth.

The app has been rewritten from scratch from React with next.js to Svelte 5 and SvelteKit. Since we went back to the start, we took the chance to rethink some of the decisions made. These changes include:

- Svelte instead of React
- Postgres with Drizzle instead of MongoDB with Prisma
- Resend instead of Mailjet for transactional emails
- More authentication options instead of just magic links
- Added option for expiration period
- Advanced password protection for secrets
- Dark mode
- Now up to 100GB file transfer
- less dependencies

These changes resulted in overall

- 2x faster builds
- 100x allowed file size
- Improved web performance metrics (Lighthouse)

We moved from a mature React + Next.js stack to **Svelte 5 with Runes mode**, along with a fresh backend and a cleaner approach to form handling, styling, and authentication.

Let’s break down the why, the how, and the learnings along the way.

---

## Why Rewrite?

Despite rising usage stats and happy customers, some flaws remained. There was the file-transfer feature that never made it out of beta, a lack of alternative login methods (only supported magic links), and some code that needed refactoring. Also infrastructure and services added some complexity.

React and Next.js served us well in the early days. But as the project grew, so did the friction — boilerplate, prop drilling, increasing complexity around data fetching and forms, and a reliance on third-party libraries for even basic needs. We started looking for a framework that:

- Reduced boilerplate
- Felt more cohesive and batteries-included
- Allowed faster iteration
- Made developers smile again

Enter **SvelteKit** and its new **Runes mode** — offering reactive state with less ceremony, built-in security features, and a streamlined developer experience.

---

## What Changed in the Stack

### 🧑‍🎨 MUI ➡️ Tailwind CSS

We dropped Material UI in favor of **Tailwind CSS** for styling. The speed, responsiveness, and utility-first approach aligned perfectly with Svelte’s philosophy. It drastically reduced CSS bloat and increased consistency across components.

### 🛢️ MongoDB + Prisma ➡️ Postgres + Drizzle

Our original stack used **MongoDB with Prisma**, which felt like a mismatch — Prisma was always slightly more SQL-focused. We’ve now fully embraced SQL with **PostgreSQL** and **Drizzle ORM**. Drizzle’s type-safety and schema-first approach play beautifully with SvelteKit.

### 🔐 NextAuth Magic Links ➡️ Custom Auth (Email + Google OAuth)

Authentication is now fully in-house. We moved from **NextAuth’s magic link-only setup** to a more flexible implementation supporting **email/password** and **Google OAuth**. This gave us more control and clarity around session management, flows, and error handling.

### 📝 Loose API Forms ➡️ Svelte Superforms

In React, our form handling leaned on ad-hoc APIs. In SvelteKit, we embraced **Superforms** — and it was a game changer. Built on top of Zod and SvelteKit’s native form handling, Superforms gave us schema-validated, reactive, and user-friendly forms with very little effort.

---

## Developer Experience: Night and Day

### ✅ What We Gained

- **Faster feedback loop** with Vite-powered dev server
- **Less boilerplate** — fewer concepts to learn, less code to write
- **Built-in security features** like CSRF protection and form handling
- **SvelteKit endpoints** that feel closer to the platform
- **Reactive primitives (Runes)** that eliminate the need for `useEffect` gymnastics

### 🤔 What We Missed

- **Ecosystem maturity** — React has more libraries, guides, and community support
- **Tooling gaps** — things like devtools and CMS integrations aren’t quite as rich
- **SSR Edge Cases** — a few quirks when dealing with external SDKs or headless CMS setups

Svelte is catching up quickly, but React still has the advantage when it comes to tooling depth and integrations with external services.

---

## Final Thoughts

The rewrite wasn’t just about a shiny new stack — it was about building something cleaner, more maintainable, and more joyful to work on.

While React is still an incredible tool, **Svelte 5 with Runes + SvelteKit** gave us the simplicity and control we were craving. And with Tailwind, Drizzle, and Superforms rounding out the stack, we now feel like we're building on solid, modern foundations.

If you're looking to start a new project — or are tired of taming the React complexity beast — SvelteKit might be worth a serious look.
