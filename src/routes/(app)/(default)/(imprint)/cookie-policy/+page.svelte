<script lang="ts">
	import markdownDocument from '$lib/assets/terms/CookiePolicy.md?raw';
	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page
	title={m.dull_tidy_sawfish_find()}
	lead={m.weary_crisp_newt_conquer()}
	markNotTranslated={true}
>
	<Container>
		<Markdown markdown={markdownDocument} format />
	</Container>
</Page>
