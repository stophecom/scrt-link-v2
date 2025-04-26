<script lang="ts">
	import markdownDocument from '$lib/assets/terms/AcceptableUsePolicy.md?raw';
	import Page from '$lib/components/page/page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page
	title={m.pretty_low_dove_transform()}
	lead={m.crazy_acidic_antelope_belong()}
	markNotTranslated={true}
>
	<Container>
		<Markdown markdown={markdownDocument} format />
	</Container>
</Page>
