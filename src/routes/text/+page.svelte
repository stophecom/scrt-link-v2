<script lang="ts">
	import Markdown from 'svelte-exmarkdown';

	import * as m from '$lib/paraglide/messages.js';

	import Page from '../page.svelte';

	const markdown = m.inner_clear_duck_bend();
</script>

<Page title="TEST">
	<div class="container">
		<div class="prose dark:prose-invert">
			<Markdown md={markdown} />
		</div>
	</div>
</Page>
