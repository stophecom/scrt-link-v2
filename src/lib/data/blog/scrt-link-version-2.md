---
title: Version 2 is here
lead: Mostly same, but better.
description: With the release of V2 we not only improved performance, security and user experience, we also added new features. And, end-to-end encrypted file transfer is generally available.
date: '2024-03-15'
categories:
  - product
  - tech
published: true
---

## Summary

After 4 years of scrt.link, the app has been rewritten from scratch. In addition to performance and security improvements, we’ve introduced new features such as more granular privacy options, social login, and new types of secrets.  
Existing secret links will continue to function, and the old app (V1) will remain accessible at [v1.scrt.link](https://v1.scrt.link) until at least 06/2025.

## Long version

Scrt.link started as a side project in 2021. Since then, it has steadily grown its [audience](https://plausible.io/scrt.link?period=12mo&keybindHint=L). Still, some of the early architectural decisions turned out to be burdensome, and some of the code wasn’t well written, containing experiments and shortcuts from the early days. In other words, technical debt that isn’t fun to maintain. Additionally, some features never made it into production. Given all this, it felt like the right decision to start over and build a **better foundation for the future**.

All the architectural improvements aside (which will be covered in a separate blog post), we also aimed to enhance the user experience, which has always been one of the key differentiating factors of our product.
One of those flaws was the authentication system. We only ever offered magic links. What appeared easy turned out to frustrate quite a few users. Some were completely locked out of the product due to security measures (like WAF) interfering with the magic links. To address this, we introduced **alternative authentication methods**, ensuring a more reliable and accessible login experience.

We’ve also listened to our users. In addition to purely cosmetic updates, like the **new light mode**, we now offer **expiration options** for each secret. This enhances overall security by ensuring secrets are automatically deleted after a specified period, minimizing the risk of unauthorized access.

A special mention goes to [secret files](/file). This feature is now out of beta and available to all users. You can **transfer files up to 100GB**—far more than you’ll ever need. And, as with all secrets, they are end-to-end encrypted. Finally, we introduced [Snap](/snap), a fun way to share disposable photos that vanish after being viewed.

We hope you enjoy the new version, and as always, [welcome your feedback](/contact).

Be safe,  
Chris
