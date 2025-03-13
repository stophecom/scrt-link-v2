<script lang="ts">
	import markdownDocument from '$lib/assets/terms/AcceptableUsePolicy.md?raw';
	import Page from '$lib/components/page/page.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import * as m from '$lib/paraglide/messages.js';
</script>

<Page
	title={m.pretty_low_dove_transform()}
	lead={m.crazy_acidic_antelope_belong()}
	markNotTranslated={true}
>
	<Markdown markdown={markdownDocument} format />
</Page>
