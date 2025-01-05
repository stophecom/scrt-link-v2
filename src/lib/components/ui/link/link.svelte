<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/utils.js';

	let { class: className, children, ...rest }: SvelteHTMLElements['a'] = $props();
</script>

<a class={cn('text-primary-text underline', className)} {...rest}>
	{@render children?.()}
</a>
