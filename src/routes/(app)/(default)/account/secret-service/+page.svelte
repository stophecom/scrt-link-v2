<script lang="ts">
	import UpgradeNotice from '$lib/components/blocks/upgrade-notice.svelte';
	import WhiteLabelForm from '$lib/components/forms/white-label-form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import { whiteLabelDemoWebsite } from '$lib/data/app';
	import { getUserPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let planLimits = $derived(getUserPlanLimits(data.user?.subscriptionTier));
</script>

<Card
	class="mb-6"
	title={m.curly_slimy_buzzard_support()}
	description={m.solid_north_ostrich_cheer()}
>
	{#if planLimits.whiteLabel}
		<WhiteLabelForm
			organizationIdOptions={data.organizationIdOptions}
			form={data.whiteLabelForm}
			whiteLabelDomain={data.whiteLabelDomain}
		/>
	{:else}
		<UpgradeNotice user={data.user} class="mb-6" />

		<Button href={localizeHref('/business')}>{m.inclusive_lost_parakeet_forgive()}</Button>
		<Button variant="outline" target="_blank" href={whiteLabelDemoWebsite}
			>{m.lower_fine_okapi_imagine()}</Button
		>
	{/if}
</Card>
