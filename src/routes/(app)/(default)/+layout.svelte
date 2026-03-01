<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	import Footer from '$lib/components/blocks/footer.svelte';
	import Header from '$lib/components/blocks/header.svelte';

	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<Header user={data.user} minimal={$page.data.minimalHeader} />
<main>
	{@render children()}
</main>
<Footer />
