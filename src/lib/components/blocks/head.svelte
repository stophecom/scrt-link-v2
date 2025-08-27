<script lang="ts">
	import { page } from '$app/state';
	import { DEFAULT_LOCALE, getAbsoluteLocalizedUrl } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { deLocalizeHref, locales } from '$lib/paraglide/runtime';

	type Props = {
		title?: string;
		metaDescription?: string;
		metaKeywords?: string;
	};

	let {
		title,
		metaDescription = m.elegant_muddy_wren_value(),
		metaKeywords = m.wise_honest_otter_jump()
	}: Props = $props();

	const globalPathname = deLocalizeHref(page.url.pathname);
</script>

<svelte:head>
	<title>{title} - {page.url.host}</title>
	<meta property="og:title" content="{title} - {page.url.host}" />
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content={metaKeywords} />

	<link
		rel="alternate"
		hreflang="x-default"
		href={getAbsoluteLocalizedUrl(page.url.origin, globalPathname, DEFAULT_LOCALE)}
	/>
	{#each locales as locale (locale)}
		{#if locale === DEFAULT_LOCALE}
			<link
				rel="alternate"
				hreflang={DEFAULT_LOCALE}
				href={getAbsoluteLocalizedUrl(page.url.origin, globalPathname, DEFAULT_LOCALE)}
			/>
		{:else}
			<link
				rel="alternate"
				hreflang={locale}
				href={getAbsoluteLocalizedUrl(page.url.origin, globalPathname, locale)}
			/>
		{/if}
	{/each}
</svelte:head>
