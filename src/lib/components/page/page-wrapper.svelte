<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import { m } from '$lib/paraglide/messages.js';

	import Head from './head.svelte';

	type Props = {
		metaTitle?: string;
		metaDescription?: string;
		metaKeywords?: string;
		children: Snippet;
	};

	let {
		metaTitle,
		metaDescription = m.elegant_muddy_wren_value(),
		metaKeywords = m.wise_honest_otter_jump(),
		children,
		...rest
	}: Props & SvelteHTMLElements['div'] = $props();
</script>

<Head title={metaTitle} {metaDescription} {metaKeywords} />
<div {...rest} class={cn('min-h-[calc(100vh-var(--header-height))] pt-8 pb-16', rest.class)}>
	{@render children?.()}
</div>
