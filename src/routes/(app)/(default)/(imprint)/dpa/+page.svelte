<script lang="ts">
	import DpaGenerator from '$lib/components/dpa/dpa-generator.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page title={m.dpa_title()} lead={m.dpa_lead()} markNotTranslated={true} wide>
	<Container variant="wide">
		<DpaGenerator />
	</Container>
</Page>
