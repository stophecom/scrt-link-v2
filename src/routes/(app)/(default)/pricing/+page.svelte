<script lang="ts">
	import PoweredByStripe from '$lib/assets/images/PoweredByStripe.svg?component';
	import Page from '$lib/components/page/page.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import Container from '$lib/components/ui/container/container.svelte';
	import { Section } from '$lib/components/ui/section';
	import accountAndBilling from '$lib/data/faq/accountAndBilling';
	import { m } from '$lib/paraglide/messages.js';

	import PlanSelection from './plan-selection.svelte';

	let { data } = $props();
</script>

<Page wide title={m.moving_quaint_buzzard_trip()} lead={m.slimy_next_shad_fall()}>
	<Container variant="wide" class="sm:py-10">
		{#if data.plans}
			<PlanSelection plans={data.plans} user={data.user} subscription={data.subscription} />
		{/if}
	</Container>

	<Section title={m.few_awful_chipmunk_trust()} lead={m.pretty_factual_piranha_hug()}>
		<Accordion items={accountAndBilling()} />
		<div><PoweredByStripe class="w-[180px]" /></div>
	</Section>
</Page>
