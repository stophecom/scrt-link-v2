<script lang="ts">
	import rehypeHighlight from 'rehype-highlight';
	import remarkGfm from 'remark-gfm';
	import type { Plugin } from 'svelte-exmarkdown';
	import SvelteMarkdown from 'svelte-exmarkdown';

	const gfmPlugin: Plugin = { remarkPlugin: [remarkGfm] };

	const plugins: Plugin[] = [
		gfmPlugin,
		{
			rehypePlugin: [rehypeHighlight, { ignoreMissing: true }]
		}
	];

	type Props = {
		markdown: string;
		formatCode?: boolean;
		format?: boolean;
	};
	let { markdown, format = false, formatCode }: Props = $props();
</script>

<span class={format ? 'prose' : 'hover:[&_a]:text-primary [&_a]:underline'}>
	<SvelteMarkdown md={markdown} plugins={formatCode ? plugins : [gfmPlugin]} />
</span>

<style>
	:global(.prose > pre) {
		padding: 0;
		border: 1px solid var(--color-border);
	}
</style>
