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
	<div class="w-full rounded border bg-card px-4 pb-8 pt-4 shadow-lg md:px-8">
		{#if title}
			<h2 class="mb-4 mt-6 text-2xl font-bold md:text-3xl">{title}</h2>
		{/if}
		{#if description}
			<p class="mb-4 text-xl leading-normal">{description}</p>
		{/if}
		{@render children?.()}
	</div>
</div>
