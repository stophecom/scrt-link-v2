<script lang="ts">
	import type { Plugin } from 'svelte-exmarkdown';
	import SvelteMarkdown from 'svelte-exmarkdown';

	type Props = {
		markdown: string;
		plugins?: Plugin[];
		format?: boolean;
	};
	let { markdown, format = false, plugins }: Props = $props();
</script>

<span class={format ? 'prose' : 'hover:[&_a]:text-primary [&_a]:underline'}>
	<SvelteMarkdown md={markdown} {plugins} />
</span>
