<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import { languageTag } from '$lib/paraglide/runtime';
	import type { BlogCategory } from '$lib/types';

	let {
		date,
		categories,
		...rest
	}: { date: string; categories: BlogCategory[] } & SvelteHTMLElements['div'] = $props();
</script>

<div class={cn('text-muted-foreground flex items-center', rest.class)} {...rest}>
	<span class="me-3">
		{new Intl.DateTimeFormat(languageTag(), {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(date))}
	</span>
	{#each categories as category}
		<span class="bg-muted me-2 rounded-full px-2 py-1 text-xs">
			<span class="text-muted-foreground">#</span>
			{category}
		</span>
	{/each}
</div>
