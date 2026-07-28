<script lang="ts">
	import type { Snippet } from 'svelte';

	import Header from '$lib/components/blocks/header.svelte';

	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<!-- Every route in this group is an auth or account flow: no search value, and one
     indexable copy per locale is 14 near-duplicates for Google to reconcile.
     `follow` still lets link equity pass through to the marketing pages. -->
<svelte:head>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<Header user={data.user} isPersistent={true} />
<main>
	{@render children()}
</main>
