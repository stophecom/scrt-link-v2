import { browser } from '$app/environment';

// Google Ads tag (gtag.js) — used for the ads experiment.
const GTAG_ID = 'AW-18238501590';

declare global {
	interface Window {
		dataLayer: unknown[];
	}
}

let initialized = false;

// Injects the gtag.js script and bootstraps the global config.
// Call once on mount; only invoke when the visitor is part of the experiment.
export function initGtag() {
	if (!browser || initialized) {
		return;
	}
	initialized = true;

	const script = document.createElement('script');
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
	document.head.appendChild(script);

	window.dataLayer = window.dataLayer || [];
	// gtag pushes its raw `arguments` object onto dataLayer (per Google's snippet);
	// GTM relies on the arguments object specifically, not a plain array.
	const gtag: (...args: unknown[]) => void = function () {
		// eslint-disable-next-line prefer-rest-params
		window.dataLayer.push(arguments);
	};
	gtag('js', new Date());
	gtag('config', GTAG_ID);
}
