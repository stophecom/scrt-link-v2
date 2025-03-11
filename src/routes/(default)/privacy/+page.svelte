<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import * as m from '$lib/paraglide/messages.js';
</script>

<Page title="Privacy" lead="No ads, no tracking, no bullshit.">
	<Markdown markdown={m.trick_tidy_monkey_grow()} format={true} />
</Page>
