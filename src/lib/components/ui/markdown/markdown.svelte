<script lang="ts">
	import SvelteMarkdown from 'svelte-exmarkdown';

	type Props = {
		markdown: string;
		format?: boolean;
	};
	let { markdown, format = false }: Props = $props();
</script>

<span class={format ? 'prose dark:prose-invert' : '[&_a]:underline [&_a]:hover:text-primary'}>
	<SvelteMarkdown md={markdown} />
</span>
