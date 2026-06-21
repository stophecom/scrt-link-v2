import Plausible from 'plausible-tracker';

import { browser, dev } from '$app/environment';

export const plausible = browser
	? Plausible({
			domain: 'scrt.link',
			trackLocalhost: true,
			apiHost: dev ? 'https://plausible.io' : location.origin // We rewrite the host to tackle ad blockers. See vercel.json.
		})
	: undefined;

const SIGNUP_TRACKING_COOKIE = 'signup-tracking';

/**
 * Fire a one-off Plausible "Signup" event when the server flagged a brand-new
 * user via the `signup-tracking` cookie (value = signup method). Reads and clears
 * the cookie so the event fires exactly once. Call on mount of the post-signup
 * landing page (set-password), not globally.
 */
export const consumeSignupTracking = () => {
	if (!plausible) return;

	const method = document.cookie
		.split('; ')
		.find((c) => c.startsWith(`${SIGNUP_TRACKING_COOKIE}=`))
		?.split('=')[1];

	if (!method) return;

	document.cookie = `${SIGNUP_TRACKING_COOKIE}=; path=/; max-age=0`;
	plausible.trackEvent('Signup', {
		props: { method, whiteLabelDomain: window.location.host }
	});
};
