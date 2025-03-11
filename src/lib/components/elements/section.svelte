<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, lead, children }: { title?: string; lead?: string; children: Snippet } = $props();
</script>

<section class="py-16">
	{#if title}
		<h2 class="font-display mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
	{/if}
	{#if lead}
		<p class="mb-8 text-lg leading-normal md:text-xl">{lead}</p>
	{/if}
	{@render children?.()}
</section>
