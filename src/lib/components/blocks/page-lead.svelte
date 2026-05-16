<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	type Props = {
		lead?: string | Snippet;
		renderAsHtml?: boolean;
		class?: string;
	};

	let { lead, renderAsHtml, class: className }: Props = $props();
</script>

<p class={twMerge('mb-10 text-xl leading-snug text-balance md:text-2xl', className)}>
	{#if renderAsHtml}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html lead}
	{:else}
		{lead}
	{/if}
</p>
