<script lang="ts">
	import { type Snippet } from 'svelte';

	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';

	import type { LayoutData } from './$types';

	let { children, data }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/manifest.json" />
	<meta property="og:locale" content={getLocale()} />
	<meta property="og:site_name" content={data.domain} />

	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen" style="--color-primary: {data.theme?.primaryColor || '#000000'}">
	{@render children()}

	<footer class="border-border bg-background border-t py-4 shadow-[0_0_60px_0_rgba(0,0,0,0.08)]">
		<div class="text-muted-foreground container flex items-center justify-between">
			<span class="py-2 pe-4">©{new Date().getFullYear()} {data.name} </span>
			<small>{m.empty_spicy_firefox_fade()} <a href="https://scrt.link">scrt.link</a></small>
		</div>
	</footer>
</div>
