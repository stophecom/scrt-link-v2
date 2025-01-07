<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, lead, children }: { title?: string; lead?: string; children: Snippet } = $props();
</script>

<section class="py-16">
	{#if title}
		<h2 class="mb-6 text-5xl font-bold">{title}</h2>
	{/if}
	{#if lead}
		<p class="mb-8 text-2xl leading-normal">{lead}</p>
	{/if}
	{@render children?.()}
</section>
