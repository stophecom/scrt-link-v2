<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	import { PUBLIC_ENV } from '$env/static/public';
	import { plausible } from '$lib/client/plausible';
	import { appName } from '$lib/data/app';
	import { getLocale } from '$lib/paraglide/runtime';

	import type { LayoutData } from './$types';

	let { children }: { data: LayoutData; children: Snippet } = $props();

	onMount(async () => {
		if (plausible) {
			const { enableAutoPageviews } = plausible;

			enableAutoPageviews();
		}

		console.info(
			'%c🤫\nSo follow sparks that light your mind,\nfor those who seek, are those who find.\n\nUse promo code HIDDENTREASURE during checkout and get a nice surprise!',
			'font-size: 16px;color: #ff0083'
		);
	});
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/manifest.json" />
	<meta property="og:locale" content={getLocale()} />
	<meta property="og:site_name" content={appName} />
	<meta name="msapplication-TileColor" content="#da532c" />
	<meta name="theme-color" content="#ffffff" />

	{#if PUBLIC_ENV !== 'production'}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

{@render children()}
