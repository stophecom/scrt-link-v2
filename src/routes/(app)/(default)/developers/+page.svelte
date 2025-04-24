<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import apiDocs from '$lib/data/docs/api.md?raw';
</script>

<Page title={'Developers'} lead={'API documentation for developers.'} markNotTranslated>
	<Markdown markdown={apiDocs} format={true} formatCode />
</Page>
