<script lang="ts">
	import markdownDocument from '$lib/assets/terms/AcceptableUsePolicy.md?raw';
	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
</script>

<Page title="Acceptable Use Policy" lead="Tl;dr: Play fair." markNotTranslated={true}>
	<Markdown markdown={markdownDocument} format />
</Page>
