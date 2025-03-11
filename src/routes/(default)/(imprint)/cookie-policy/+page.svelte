<script lang="ts">
	import markdownDocument from '$lib/assets/terms/CookiePolicy.md?raw';
	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
</script>

<Page title="Cookie Policy" lead="Tl;dr: only essentials, no tracking." markNotTranslated={true}>
	<Markdown markdown={markdownDocument} format />
</Page>
