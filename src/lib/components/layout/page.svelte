<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, lead, children }: { title: string; lead?: string; children: Snippet } = $props();
</script>

<div class="container">
	<h1 class="mb-5 text-4xl font-bold">{title}</h1>

	{#if lead}
		<p class="mb-3 text-xl leading-normal">{lead}</p>
	{/if}
</div>
{@render children?.()}
