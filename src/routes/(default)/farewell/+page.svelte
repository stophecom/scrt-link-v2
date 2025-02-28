<script lang="ts">
	import Page from '$lib/components/layout/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	// import * as m from '$lib/paraglide/messages.js';

	const message = `
Just kidding. We deleted all your data from our servers. 

All the best,  
Chris
`;
</script>

<Page title="Farewell" lead="Gone, but never forgotten.">
	<Markdown markdown={message} format={true} />
</Page>
