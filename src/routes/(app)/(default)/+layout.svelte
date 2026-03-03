<script lang="ts">
	import type { Snippet } from 'svelte';

	import { page } from '$app/state';
	import Footer from '$lib/components/blocks/footer.svelte';
	import Header from '$lib/components/blocks/header.svelte';

	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let isPersistent = $derived(!!page.data.isPersistentHeader);
	let tag = $derived(page.data.headerTag);
	let breadcrumb = $derived(page.data.headerBreadcrumb);
</script>

<Header user={data.user} {isPersistent} {tag} {breadcrumb} />
<main>
	{@render children()}
</main>
<Footer />
