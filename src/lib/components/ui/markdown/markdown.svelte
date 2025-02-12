<script lang="ts">
	import SvelteMarkdown from 'svelte-exmarkdown';

	type Props = {
		markdown: string;
		format?: boolean;
	};
	let { markdown, format = false }: Props = $props();
</script>

<span class={format ? 'prose' : 'hover:[&_a]:text-primary [&_a]:underline'}>
	<SvelteMarkdown md={markdown} />
</span>
