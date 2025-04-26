<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page title={m.polite_misty_jan_hint()} lead={m.such_bright_panther_rush()}>
	<Container>
		<Markdown markdown={m.polite_clean_canary_walk()} format={true} />
	</Container>
</Page>
