<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { languageTag } from '$lib/paraglide/runtime';
	import type { BlogCategory } from '$lib/types';
	let {
		date,
		categories,
		...rest
	}: { date: string; categories: BlogCategory[] } & SvelteHTMLElements['div'] = $props();
</script>

<div class="text-muted-foreground text-sm" {...rest}>
	{new Intl.DateTimeFormat(languageTag()).format(new Date(date))}
	&bull;
	{#each categories as category}
		<span class="me-2">
			#{category}
		</span>
	{/each}
</div>
