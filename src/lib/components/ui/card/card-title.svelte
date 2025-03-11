<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';

	type Props = {
		children: Snippet;
	};
	let { children, ...rest }: Props & SvelteHTMLElements['h2'] = $props();
</script>

<h2 {...rest} class={cn('mt-2 mb-4 text-2xl font-bold md:text-3xl', rest.class)}>
	{@render children?.()}
</h2>
