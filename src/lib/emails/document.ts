import { getLocale } from '$lib/paraglide/runtime.js';

import { colors, fontFamily } from './styles';

/**
 * Wraps rendered email body markup in a minimal HTML document shell.
 *
 * Email clients ignore <style> blocks, so the structural styles are inlined
 * here: the <body> carries the page background, font and text color. The email
 * components themselves only render their inner content (see email-layout.svelte).
 */
export const wrapEmailDocument = (head: string, body: string): string =>
	`<!doctype html><html lang="${getLocale()}"><head>` +
	`<meta charset="utf-8">` +
	`<meta name="viewport" content="width=device-width, initial-scale=1.0">` +
	`<meta name="color-scheme" content="light">` +
	`<meta name="supported-color-schemes" content="light">` +
	`${head}</head>` +
	`<body style="margin:0;padding:0;background-color:${colors.background};font-family:${fontFamily};color:${colors.foreground};">` +
	`${body}</body></html>`;
