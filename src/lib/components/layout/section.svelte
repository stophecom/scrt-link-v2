<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, lead, children }: { title?: string; lead?: string; children: Snippet } = $props();
</script>

<main class="container flex flex-col justify-center py-8">
	{#if title}
		<h2 class="text-4xl">{title}</h2>
	{/if}
	{#if lead}
		<p class="text-xl leading-normal">{lead}</p>
	{/if}
	{@render children?.()}
</main>
