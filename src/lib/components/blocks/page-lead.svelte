<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		lead?: string | Snippet;
		renderAsHtml?: boolean;
	};

	let { lead, renderAsHtml }: Props = $props();
</script>

<p class="mb-10 text-xl leading-snug text-pretty md:text-2xl">
	{#if renderAsHtml}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html lead}
	{:else}
		{lead}
	{/if}
</p>
