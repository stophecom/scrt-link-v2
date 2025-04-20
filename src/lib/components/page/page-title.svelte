<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';

	type Props = {
		title: string;
	};

	let { title, ...rest }: Props & SvelteHTMLElements['h1'] = $props();
</script>

<h1
	{...rest}
	class={cn(
		'gradient-text font-display mb-1 text-5xl leading-tight font-extrabold text-pretty md:text-6xl',
		rest.class
	)}
>
	{title}
</h1>
