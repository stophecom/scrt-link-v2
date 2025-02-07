<script lang="ts">
	import Typewriter from 'svelte-typewriter';

	import Page from '$lib/components/layout/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import * as m from '$lib/paraglide/messages.js';

	const markdown = m.inner_clear_duck_bend();
</script>

<Page title="TEST">
	<Markdown {markdown} format />
	<Typewriter delay={1212}><h2>Hallo Hallo Hallod</h2></Typewriter>
</Page>
