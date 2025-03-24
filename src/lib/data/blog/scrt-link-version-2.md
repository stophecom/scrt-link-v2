---
title: Version 2 is here
lead: Mostly same, but better.
description: With the release of Version 2, performance, security, and user experience have been significantly improved, along with the addition of new features. End-to-end encrypted file transfer is now generally available.
date: '2024-03-15'
categories:
  - product
  - tech
published: true
---

## Summary

After 4 years of scrt.link, the app has been completely rewritten from scratch. In addition to improvements in performance and security, new features have been introduced—such as more **granular privacy options, social login, and additional secret types**.  
Existing secret links will continue to function, and the old app (V1) will remain accessible at [v1.scrt.link](https://v1.scrt.link) until at least 06/2025.

## Long version

Scrt.link started as a side project in 2021. Since then, it has steadily grown its audience. Still, some of the early architectural decisions turned out to be burdensome, and some of the code wasn’t well written, containing experiments and shortcuts from the early days. In other words, technical debt that isn’t fun to maintain. Additionally, some features never made it into production. Given all this, it felt like the right decision to start over and build a **better foundation for the future**.

All the architectural improvements aside (which will be covered in a separate blog post), the user experience, which has always been one of the key differentiating factors of our product, remained a top priority. One particular **pain point was authentication**. Magic links were the only option available for logging in. While simple in theory, this approach ended up frustrating quite some users—some even found themselves locked out entirely. To solve this, **alternative authentication methods have been added**, providing a more reliable and accessible way to log in.

Beyond visual refinements like the new **light mode** and updated theme colors, many changes were guided directly by user feedback. One example: **Expiration options** for each secret. This feature adds an **extra layer of security** by ensuring that secrets are automatically deleted after a set period, reducing the risk of unauthorized access.

A special mention goes to [secret files](/file). This feature is now out of beta and available to all users. You can **transfer files up to 100GB**—far more than you’ll ever need. And, as with all secrets, they are end-to-end encrypted.

Finally, [Snap](/snap) was introduced: A fun way to share disposable photos that vanish after being viewed.

I hope you enjoy the new version, and as always, [welcome your feedback](/contact).

Be safe,  
Chris
