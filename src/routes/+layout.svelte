<script lang="ts">
	import '../app.css';

	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';
	import type { Snippet } from 'svelte';

	import { PUBLIC_ENV } from '$env/static/public';
	import { appName } from '$lib/data/app';
	import { i18n } from '$lib/i18n';

	import type { LayoutData } from './$types';

	let { children }: { data: LayoutData; children: Snippet } = $props();

	let title = appName;
	let description =
		'Share a one-time secret. With scrt.link you can transmit passwords, credit card information, private keys or other sensitive data in a secure way: End-to-end encrypted. One time.';
	let keywords =
		'secret link, secret message link, one time secret, one time password, one time message, one time link, disposable message, disposable link, url shortener, self-destructive links, share sensitive information';
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/manifest.json" />
	<meta name="msapplication-TileColor" content="#da532c" />
	<meta name="theme-color" content="#ffffff" />
	{#if PUBLIC_ENV !== 'production'}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
<ModeWatcher />
