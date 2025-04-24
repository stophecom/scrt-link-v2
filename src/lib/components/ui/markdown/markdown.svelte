<script lang="ts">
	import 'highlight.js/styles/github.css';

	import rehypeHighlight from 'rehype-highlight';
	import type { Plugin } from 'svelte-exmarkdown';
	import SvelteMarkdown from 'svelte-exmarkdown';

	const plugins: Plugin[] = [
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
	<SvelteMarkdown md={markdown} plugins={formatCode ? plugins : undefined} />
</span>
