<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/utils.js';

	let { class: className, children, href, ...rest }: SvelteHTMLElements['a'] = $props();
</script>

<a class={cn('text-primary-text underline', className)} {href} {...rest}>
	{@render children?.()}
</a>
