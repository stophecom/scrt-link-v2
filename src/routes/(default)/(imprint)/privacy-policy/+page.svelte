<script lang="ts">
	import markdownDocument from '$lib/assets/terms/PrivacyPolicy.md?raw';
	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
</script>

<Page title="Privacy Policy" lead="Tl;dr: Privacy matters." markNotTranslated={true}>
	<Markdown markdown={markdownDocument} format />
</Page>
