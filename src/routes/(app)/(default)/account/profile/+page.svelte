<script lang="ts">
	import BillingInvoicesCard from '$lib/components/blocks/billing-invoices-card.svelte';
	import BillingPlanCard from '$lib/components/blocks/billing-plan-card.svelte';

	import AccountCard from '../account-card.svelte';
	import EncryptionRecoveryCard from '../encryption-recovery-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<AccountCard user={data.user} form={data.userForm} />

<BillingPlanCard
	subscription={data.subscription}
	planName={data.planName}
	stripePortalUrl={data.stripePortalUrl}
	class="mb-4"
/>

{#if data.invoices.length > 0}
	<BillingInvoicesCard invoices={data.invoices} class="mb-4" />
{/if}

{#if data.encryptionEnabled && data.keyStore}
	<EncryptionRecoveryCard
		hasRecoveryKey={data.hasRecoveryKey}
		keyStore={data.keyStore}
		passwordForm={data.recoveryPasswordForm}
		recoveryForm={data.recoveryForm}
	/>
{/if}
