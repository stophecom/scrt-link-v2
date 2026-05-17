<script lang="ts">
	import { type Snippet } from 'svelte';

	import { page } from '$app/state';
	import { getLocale } from '$lib/paraglide/runtime';
	import type { Theme } from '$lib/types';

	import type { LayoutData } from './$types';

	let { children, data }: { data: LayoutData; children: Snippet } = $props();

	// Build a dynamic <style> tag injecting CSS custom property overrides for both modes.
	// String-concat prevents Svelte's CSS preprocessor from trying to parse the template literal.
	function buildThemeStyleTag(theme: Theme | undefined): string {
		if (!theme) return '';
		const rules: string[] = [];

		const cssVars = (colors: Theme['light'] | undefined, fallbackPrimary?: string): string[] => {
			const pairs: string[] = [];
			if (colors?.background) pairs.push(`  --background:${colors.background}`);
			if (colors?.foreground) pairs.push(`  --foreground:${colors.foreground}`);
			const primary = colors?.primary ?? fallbackPrimary;
			if (primary) pairs.push(`  --primary:${primary}`);
			if (colors?.card) pairs.push(`  --card:${colors.card}`);
			if (colors?.destructive) pairs.push(`  --destructive:${colors.destructive}`);
			if (colors?.success) pairs.push(`  --success:${colors.success}`);
			if (colors?.info) pairs.push(`  --info:${colors.info}`);
			return pairs;
		};

		const lightPairs = cssVars(theme.light, theme.primaryColor);
		if (lightPairs.length) rules.push(`:root{${lightPairs.join(';')}}`);

		const darkPairs = cssVars(theme.dark);
		if (darkPairs.length) rules.push(`.dark{${darkPairs.join(';')}}`);

		if (!rules.length) return '';
		return '<' + 'style>' + rules.join('') + '</' + 'style>';
	}

	const themeStyleTag = $derived(buildThemeStyleTag(data.theme as Theme));

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

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html themeStyleTag}
<div class="min-h-screen">
	{@render children()}
</div>
