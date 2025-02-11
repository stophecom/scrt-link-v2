<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		children: Snippet;
		title?: string;
		description?: string;
	};
	let { children, title, description, ...rest }: Props & SvelteHTMLElements['div'] = $props();
</script>

<div {...rest}>
	<div class="border-border bg-card w-full rounded border px-4 py-6 shadow-lg md:p-8">
		{#if title}
			<h2 class="mt-6 mb-4 text-2xl font-bold md:text-3xl">{title}</h2>
		{/if}
		{#if description}
			<p class="mb-4 text-xl leading-normal">{description}</p>
		{/if}
		{@render children?.()}
	</div>
</div>
