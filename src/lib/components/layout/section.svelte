<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, lead, children }: { title?: string; lead?: string; children: Snippet } = $props();
</script>

<section class="py-32">
	{#if title}
		<h2 class="mb-4 text-4xl font-bold md:text-5xl">{title}</h2>
	{/if}
	{#if lead}
		<p class="mb-8 text-xl leading-normal md:text-2xl">{lead}</p>
	{/if}
	{@render children?.()}
</section>
