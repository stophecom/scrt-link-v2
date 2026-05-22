<script lang="ts">
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import cliDocs from '$lib/data/docs/cli.md?raw';
</script>

<Page wide title="CLI" lead="Create encrypted secrets from the command line." markNotTranslated>
	<Container variant="wide">
		<Markdown markdown={cliDocs} format={true} formatCode />
	</Container>
</Page>
