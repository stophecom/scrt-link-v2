<script lang="ts">
	import SvelteMarkdown from 'svelte-exmarkdown';

	type Props = {
		markdown: string;
	};
	let { markdown }: Props = $props();
</script>

<span class="prose dark:prose-invert">
	<SvelteMarkdown md={markdown} />
</span>
