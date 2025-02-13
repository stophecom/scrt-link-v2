<script lang="ts">
	import Page from '$lib/components/layout/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import * as m from '$lib/paraglide/messages.js';
</script>

<Page title="About" lead="The less we know, the better.">
	<Markdown markdown={m.polite_clean_canary_walk()} format={true} />
</Page>
