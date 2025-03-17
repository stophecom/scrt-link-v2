import Plausible from 'plausible-tracker';

import { browser, dev } from '$app/environment';

export const plausible = browser
	? Plausible({
			domain: 'scrt.link',
			trackLocalhost: true,
			apiHost: dev ? 'https://plausible.io' : location.origin // We rewrite the host to tackle ad blockers. See vercel.json.
		})
	: undefined;
