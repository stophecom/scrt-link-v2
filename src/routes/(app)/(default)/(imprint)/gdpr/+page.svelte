<script lang="ts">
	import markdownDocument from '$lib/assets/terms/GDPR.md?raw';
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page title={'GDPR Compliance'} lead={m.male_dry_haddock_harbor()} markNotTranslated={true}>
	<Container>
		<Markdown markdown={markdownDocument} format />
	</Container>
</Page>
