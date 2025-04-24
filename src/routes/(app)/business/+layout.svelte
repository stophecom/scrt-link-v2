<script lang="ts">
	import type { Snippet } from 'svelte';

	import Footer from '$lib/components/elements/footer.svelte';
	import Header from '$lib/components/elements/header.svelte';

	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<Header user={data.user} wide business />
<main>
	{@render children()}
</main>
<Footer />
