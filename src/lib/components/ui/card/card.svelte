<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';

	import CardTitle from './card-title.svelte';

	type Props = {
		children: Snippet;
		title?: string;
		description?: string;
	};
	let { children, title, description, ...rest }: Props & SvelteHTMLElements['div'] = $props();
</script>

<div
	class={cn('border-border bg-card w-full  rounded border px-4 py-6 shadow-lg md:p-8', rest.class)}
>
	{#if title}
		<CardTitle>
			{title}
		</CardTitle>
	{/if}
	{#if description}
		<p class="mb-4 text-xl leading-normal text-pretty">{description}</p>
	{/if}
	{@render children?.()}
</div>
