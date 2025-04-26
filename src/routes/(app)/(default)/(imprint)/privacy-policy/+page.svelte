<script lang="ts">
	import markdownDocument from '$lib/assets/terms/PrivacyPolicy.md?raw';
	import Page from '$lib/components/page/page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page
	title={m.crazy_jumpy_mouse_hush()}
	lead={m.male_dry_haddock_harbor()}
	markNotTranslated={true}
>
	<Container>
		<Markdown markdown={markdownDocument} format />
	</Container>
</Page>
