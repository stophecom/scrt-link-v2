<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page title={m.polite_misty_jan_hint()} lead={m.such_bright_panther_rush()}>
	<Markdown markdown={m.polite_clean_canary_walk()} format={true} />
</Page>
