<script lang="ts">
	import { page } from '$app/state';
	import { DEFAULT_LOCALE, getAbsoluteLocalizedUrl } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { deLocalizeHref, locales } from '$lib/paraglide/runtime';

	type Props = {
		title?: string;
		metaDescription?: string;
		metaKeywords?: string;
		// For pages that only exist in English: point every locale at the base-locale URL
		// and don't advertise hreflang alternates that aren't actually translated.
		englishOnly?: boolean;
	};

	let {
		title,
		metaDescription = m.elegant_muddy_wren_value(),
		metaKeywords = m.wise_honest_otter_jump(),
		englishOnly = false
	}: Props = $props();

	const globalPathname = deLocalizeHref(page.url.pathname);

	// Derived from the URL itself, not from getLocale(): the active locale can come from a
	// cookie, which would otherwise make /de/pricing claim /pricing as its canonical and
	// have search engines drop every localized page as a duplicate.
	// English-only pages do point every locale at the base-locale URL — that is the intent.
	const canonical = $derived(
		englishOnly ? `${page.url.origin}${globalPathname}` : `${page.url.origin}${page.url.pathname}`
	);
</script>

<svelte:head>
	<title>{title} - {page.url.host}</title>
	<meta property="og:title" content="{title} - {page.url.host}" />
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content={metaKeywords} />

	<link rel="canonical" href={canonical} />

	{#if !englishOnly}
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
	{/if}
</svelte:head>
