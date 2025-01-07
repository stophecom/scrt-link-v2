<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, description, children }: { title: string; description?: string; children: Snippet } =
		$props();
</script>

<div class="container flex justify-center pb-8 pt-16">
	<div class="w-full max-w-md rounded border bg-card px-8 pb-8 pt-12 shadow-lg">
		<h1 class="mb-4 text-3xl font-bold">{title}</h1>
		{#if description}
			<p class="mb-4 text-xl leading-normal">{description}</p>
		{/if}

		{@render children?.()}
	</div>
</div>
