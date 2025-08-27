<script lang="ts">
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import apiDocs from '$lib/data/docs/api.md?raw';
</script>

<Page wide title="Developers" lead="API documentation for developers." markNotTranslated>
	<Container variant="wide">
		<Markdown markdown={apiDocs} format={true} formatCode />
	</Container>
</Page>
