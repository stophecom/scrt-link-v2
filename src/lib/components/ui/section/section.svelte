<script lang="ts">
	import { type Icon as IconType } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import { Container } from '$lib/components/ui/container';

	import { sectionVariants, type Variant } from './index.js';

	type Props = {
		variant?: Variant;
		Icon?: typeof IconType;
		title?: string;
		lead?: string;
		wide?: boolean;
		children: Snippet;
	};

	let {
		variant = 'default',
		Icon,
		title,
		lead,
		wide,
		children,
		...rest
	}: Props & SvelteHTMLElements['section'] = $props();
</script>

<section {...rest} class={cn(sectionVariants({ variant }), rest.class)}>
	<Container variant={wide ? 'wide' : 'default'}>
		{#if Icon}
			<div class="mb-4">
				<Icon class="h-16 w-16" strokeWidth="1.4px" />
			</div>
		{/if}

		{#if title}
			<h2 class="font-display mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
		{/if}
		{#if lead}
			<p class="mb-8 text-lg leading-normal text-pretty md:text-xl">{lead}</p>
		{/if}
		{@render children?.()}
	</Container>
</section>
