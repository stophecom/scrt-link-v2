<script lang="ts">
	import TOS from '$lib/assets/terms/TermsOfService.md?raw';
	import Page from '$lib/components/layout/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
</script>

<Page title="Terms Of Service" lead="Tl;dr: Pretty much standard." markNotTranslated={true}>
	<Markdown markdown={TOS} />
</Page>
