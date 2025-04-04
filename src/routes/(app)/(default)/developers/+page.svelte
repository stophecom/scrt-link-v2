<script lang="ts">
	import 'highlight.js/styles/github.css';

	import rehypeHighlight from 'rehype-highlight';
	import type { Plugin } from 'svelte-exmarkdown';

	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import apiDocs from '$lib/data/docs/api.md?raw';

	const plugins: Plugin[] = [
		{
			rehypePlugin: [rehypeHighlight, { ignoreMissing: true }]
		}
	];
</script>

<Page title={'Developers'} lead={'API documentation for developers.'} markNotTranslated>
	<Markdown markdown={apiDocs} format={true} {plugins} />
</Page>
