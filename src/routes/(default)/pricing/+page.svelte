<script lang="ts">
	import PoweredByStripe from '$lib/assets/images/PoweredByStripe.svg?component';
	import Page from '$lib/components/layout/page/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import accountAndBilling from '$lib/data/faq/accountAndBilling';
	import * as m from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>
<Page title={m.moving_quaint_buzzard_trip()} lead={m.slimy_next_shad_fall()}>
	<stripe-pricing-table
		pricing-table-id="prctbl_1QxwfGBo4UBHEOfAoo9scvM0"
		publishable-key="pk_live_5XZb1AkCSXkoFiN8MR7kvndp"
	>
	</stripe-pricing-table>
	<Section title="FAQ" lead={m.pretty_factual_piranha_hug()}>
		<Accordion items={accountAndBilling()} />
	</Section>
	<div><PoweredByStripe class="w-[180px]" /></div>
</Page>
