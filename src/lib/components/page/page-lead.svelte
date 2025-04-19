<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		lead?: string | Snippet;
	};

	let { lead }: Props = $props();
</script>

<p class="mb-10 text-2xl leading-snug text-pretty md:text-3xl">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html lead}
</p>
