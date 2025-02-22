---
title: Scrt.link vs. Onetime Secret
lead: A comparison between Scrt.link and Onetime Secret
description: Scrt.link and Onetime Secret both offer secure, self-destructing message sharing—but how do they compare? In this post, we break down the key differences in security, privacy, and user experience to help you choose the right tool for your needs.
date: '2021-12-13'
ogImage: '/images/blog/comparison-one-time-secret-og.png'
categories:
  - product
  - tech
published: true
---

When it comes to sharing sensitive information online, you’ll likely come across [Onetime Secret](https://onetimesecret.com) sooner or later. In fact, it ranks #1 on Google for many searches related to secure secret sharing. According to their website, over 50000 secrets are shared through the platform each month. For context, the site has been **running for over a decade**.

![comparison-one-time-secret-screenshot.png](/images/blog/comparison-one-time-secret-screenshot.png)
_Screenshot from 2011 via [Archive.org](http://web.archive.org/web/20111220213636/https://onetimesecret.com/)_

## A Great Source of Inspiration

When you visit [Onetime Secret](https://onetimesecret.com) for the first time, it becomes obvious what the creators intended. The website is, above all, practical—it offers a simple interface to help you do one specific thing: create one-time secrets. It's an unpretentious, fast, and responsive website without overhead, distractions, or ads. It's clearly a project run by idealists, not incentivized by selling out its users. To me, it is also a reminder that the web is (still) a great place.

## One Big Caveat

Now, after digging the topic of secure disposable messaging and analyzing the website from a security perspective, I came to notice **one big flaw**: Messages are not end-to-end encrypted.

![comparison-one-time-secret-screenshot-console.png](/images/blog/comparison-one-time-secret-screenshot-console.png)

As shown in the screenshot, the secret is sent to the server in plain text. This doesn’t mean that anyone on the network can simply eavesdrop on your message—the connection is still secured with HTTPS. However, this approach introduces potential security risks.

In practice, this means the backend receives your secret in plain text. As a user, you must fully trust the service to handle your data securely. Even if you do, a successful attack on the server could still expose your confidential information.

## A Different Approach

No one—including the service provider—should be implicitly trusted when handling personal secrets. That’s why our service is not only **100% open source** but also designed to minimize potential risks. We use **end-to-end encryption**, ensuring that secrets are encrypted and decrypted entirely in the browser, where you have full access to the code running the website.

![comparison-one-time-secret-screenshot-e2e.webp](/images/blog/comparison-one-time-secret-screenshot-e2e.webp)
In the screenshot, you’ll notice that the secret is already encrypted before being sent to the server. You can verify this yourself by opening the network tab in DevTools and inspecting the POST request to the API.

## There Is More

In addition to end-to-end encryption, scrt.link offers a range of features, including file transfers, one-time redirects, and more. Be sure to check it out!

### **Other Alternatives**

Scrt.link is just one of many alternatives to Onetime Secret. Some other tools offer similar security features. Explore and compare to find the best fit for your needs.

- https://privatebin.info/
- https://yopass.se/
- https://1ty.me/
- https://www.saltify.io/en/
- https://password.link/
- https://privnote.com/
- https://pwpush.com/
