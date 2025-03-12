import Plausible from 'plausible-tracker';

import { browser, dev } from '$app/environment';

// @todo Cleanup once V1 is sunsetted.
export const plausible = browser
	? Plausible({
			domain: dev ? 'v2.scrt.link' : location.hostname, // Should be scrt.link eventually
			trackLocalhost: true,
			apiHost: dev ? 'https://plausible.io' : location.origin // We rewrite the host to tackle ad blockers. See vercel.json.
		})
	: undefined;
