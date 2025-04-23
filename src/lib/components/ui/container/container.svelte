<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';

	import { containerVariants, type Variant } from './index.js';

	type Props = { children: Snippet; variant?: Variant };
	let { children, variant = 'default', ...rest }: Props & SvelteHTMLElements['div'] = $props();
</script>

<div {...rest} class={cn(containerVariants({ variant }), rest.class)}>
	{@render children()}
</div>
