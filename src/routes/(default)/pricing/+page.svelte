<script lang="ts">
	import PoweredByStripe from '$lib/assets/images/PoweredByStripe.svg?component';
	import Section from '$lib/components/elements/section.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import accountAndBilling from '$lib/data/faq/accountAndBilling';
	import * as m from '$lib/paraglide/messages.js';

	import PlanSelection from './plan-selection.svelte';

	let { data } = $props();
</script>

<Page title={m.moving_quaint_buzzard_trip()} lead={m.slimy_next_shad_fall()}>
	<div class="sm:py-10">
		{#if data.plans}
			<PlanSelection plans={data.plans} user={data.user} subscription={data.subscription} />
		{/if}
	</div>

	<Section title="FAQ" lead={m.pretty_factual_piranha_hug()}>
		<Accordion items={accountAndBilling()} />
	</Section>
	<div><PoweredByStripe class="w-[180px]" /></div>
</Page>
