<script lang="ts">
	import '../app.css';

	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';
	import type { Snippet } from 'svelte';

	import { PUBLIC_ENV } from '$env/static/public';
	import { appName } from '$lib/data/app';
	import { i18n } from '$lib/i18n';
	import { languageTag } from '$lib/paraglide/runtime';

	import type { LayoutData } from './$types';

	let { children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/manifest.json" />
	<meta property="og:locale" content={languageTag()} />
	<meta property="og:site_name" content={appName} />
	<meta name="msapplication-TileColor" content="#da532c" />
	<meta name="theme-color" content="#ffffff" />

	{#if PUBLIC_ENV !== 'production'}
		<meta name="robots" content="noindex" />
	{/if}

	<script
		defer
		data-domain="v2.scrt.link"
		src="/js/script.pageview-props.revenue.tagged-events.js"
	></script>
</svelte:head>

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
<ModeWatcher />
