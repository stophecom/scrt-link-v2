<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, lead, children }: { title: string; lead?: string; children: Snippet } = $props();
</script>

<main>
	<div class="container flex flex-col items-center justify-center">
		<h2 class="text-4xl">{title}</h2>
		<p class="text-xl leading-normal">{lead}</p>

		{@render children?.()}
	</div>
</main>
