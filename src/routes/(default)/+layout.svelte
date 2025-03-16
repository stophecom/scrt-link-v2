<script lang="ts">
	import type { Snippet } from 'svelte';

	import Footer from '$lib/components/elements/footer.svelte';
	import Header from '$lib/components/elements/header.svelte';
	import { secretMenu } from '$lib/data/menu';
	import { getLocalizedUrl } from '$lib/i18n';
	import { availableLanguageTags } from '$lib/paraglide/runtime';

	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// Hide the "Create secret" button on specific routes.
	// @todo Rethink this
	let isCreateSecretButtonHidden = $state(false);
	const homePath = ''; // Home
	const pricingPath = '/pricing';
	const secretMenuPaths = secretMenu().map((item) => item.href);

	const languageSpecificLandingPages = availableLanguageTags.map((locale) =>
		[homePath, pricingPath, ...secretMenuPaths].map((path) => getLocalizedUrl(path, locale))
	);

	$effect(() => {
		isCreateSecretButtonHidden = languageSpecificLandingPages.flat().includes(data.pathname);
	});
</script>

<Header user={data.user} hideCreateSecretButton={isCreateSecretButtonHidden} />
<main>
	{@render children()}
</main>
<Footer />
