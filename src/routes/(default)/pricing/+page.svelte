<script lang="ts">
	import PoweredByStripe from '$lib/assets/images/PoweredByStripe.svg?component';
	import Page from '$lib/components/layout/page/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import accountAndBilling from '$lib/data/faq/accountAndBilling';
	import * as m from '$lib/paraglide/messages.js';

	import PlanSelection from './plan-selection.svelte';

	let { data } = $props();
</script>

<Page title={m.moving_quaint_buzzard_trip()} lead={m.slimy_next_shad_fall()}>
	<Section>
		{#if data.plans}
			<PlanSelection
				plans={data.plans}
				user={data.user}
				subscription={data.subscription}
				stripePortalUrl={data.stripePortalUrl}
			/>
		{/if}
	</Section>

	<Section title="FAQ" lead={m.pretty_factual_piranha_hug()}>
		<Accordion items={accountAndBilling()} />
	</Section>
	<div><PoweredByStripe class="w-[180px]" /></div>
</Page>
