<script lang="ts">
	import markdownDocument from '$lib/assets/terms/SLA.md?raw';
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page
	title={m.large_due_javelina_engage()}
	lead={m.topical_jumpy_gazelle_cook()}
	markNotTranslated={true}
>
	<Container>
		<Markdown markdown={markdownDocument} format />
	</Container>
</Page>
