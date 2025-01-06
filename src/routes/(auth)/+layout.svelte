<script lang="ts">
	import type { Snippet } from 'svelte';

	import Header from '$lib/components/layout/header.svelte';

	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<Header user={data.user} />
<main>
	{@render children()}
</main>
