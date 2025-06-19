<script lang="ts">
	import { type Snippet } from 'svelte';

	import { page } from '$app/state';
	import { getLocale } from '$lib/paraglide/runtime';

	import type { LayoutData } from './$types';

	let { children, data }: { data: LayoutData; children: Snippet } = $props();

	const faviconUrl32 = data.appIcon
		? `${data.appIcon}?auto=compress&w=32&h=32&fit=crop&fm=png`
		: '/favicon-32x32.png';

	const faviconUrl16 = data.appIcon
		? `${data.appIcon}?auto=compress&w=16&h=16&fit=crop&fm=png`
		: '/favicon-16x16.png';

	const appleTouch = data.appIcon
		? `${data.appIcon}?auto=compress&w=180&h=180&fit=crop&fm=png`
		: '/apple-touch-icon.png';

	const ogImage = data.ogImage
		? `${data.appIcon}?auto=compress&w=1200&h=630&fit=crop&fm=png`
		: '/og-image.png';
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouch} />
	<link rel="icon" type="image/png" sizes="32x32" href={faviconUrl32} />
	<link rel="icon" type="image/png" sizes="16x16" href={faviconUrl16} />

	<meta property="og:locale" content={getLocale()} />
	<meta property="og:site_name" content={data.domain} />

	<meta property="og:url" content={page.url.href} />
	<meta property="og:type" content="website" />

	<meta property="og:image" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={data.name} />

	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen" style="--color-primary: {data.theme?.primaryColor || '#000000'}">
	{@render children()}
</div>
