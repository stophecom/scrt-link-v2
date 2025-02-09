<script lang="ts">
	import CreateSecret from '$lib/components/layout/create-secret.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { shortFaq } from '$lib/data/faq';
	import * as m from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title={m.lucky_warm_mayfly_engage()} lead={m.aloof_quaint_snail_pave()}>
	<CreateSecret {data} />

	<Section title="FAQ" lead={m.stock_keen_marten_commend()}>
		<Accordion items={shortFaq()} />

		<Button href="/faq">{m.white_top_warbler_buzz()}</Button>
	</Section>
</Page>
