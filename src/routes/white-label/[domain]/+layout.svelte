<script lang="ts">
	import '../../../app.css';

	import { ModeWatcher } from 'mode-watcher';
	import { type Snippet } from 'svelte';

	import NavigationProgress from '$lib/components/elements/navigation-progress.svelte';
	import { getLocale } from '$lib/paraglide/runtime';

	import type { LayoutData } from './$types';

	let { children, data }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/manifest.json" />
	<meta property="og:locale" content={getLocale()} />
	<meta property="og:site_name" content={data.domain} />
	<meta name="msapplication-TileColor" content="#da532c" />
	<meta name="theme-color" content="#ffffff" />

	<meta name="robots" content="noindex" />
</svelte:head>

<div style="--color-primary: {data.theme?.primaryColor}">
	<NavigationProgress />

	{@render children()}

	<ModeWatcher />
</div>
