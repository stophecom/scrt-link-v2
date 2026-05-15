<script lang="ts">
	import BillingInvoicesCard from '$lib/components/blocks/billing-invoices-card.svelte';
	import BillingPlanCard from '$lib/components/blocks/billing-plan-card.svelte';
	import UpdateBillingOwnerForm from '$lib/components/forms/update-billing-owner-form.svelte';
	import Card from '$lib/components/ui/card';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<BillingPlanCard
	subscription={data.orgSubscription}
	planName={data.planName}
	stripePortalUrl={data.stripePortalUrl}
	pricingHref={localizeHref('/pricing?tab=business')}
	seatCount={data.seatCount}
	monthlyAmountCents={data.monthlyAmountCents}
	currency={data.currency}
	class="mb-4"
/>

{#if data.isOrgOwner && data.members.length > 0}
	<Card class="mb-4" title={m.early_bright_salmon_comfort()}>
		<UpdateBillingOwnerForm form={data.updateBillingOwnerForm} members={data.members} />
	</Card>
{/if}

<BillingInvoicesCard invoices={data.invoices} />
