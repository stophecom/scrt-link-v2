<script lang="ts">
	import UpgradeNotice from '$lib/components/blocks/upgrade-notice.svelte';
	import WhiteLabelForm from '$lib/components/forms/white-label-form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import { getUserPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { LayoutData } from '../$types';
	import OrganizationCard from '../organization-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData & LayoutData } = $props();
	let planLimits = $derived(getUserPlanLimits(data.user?.subscriptionTier));
</script>

<OrganizationCard
	user={data.user}
	organization={data.userOrganization}
	organizationForm={data.organizationForm}
	inviteOrganizationMemberForm={data.inviteOrganizationMemberForm}
	manageOrganizationMemberForm={data.manageOrganizationMemberForm}
/>

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
		<UpgradeNotice tier={data.user?.subscriptionTier} class="mb-6" />

		<Button variant="outline" href={localizeHref('/business')}>{m.fit_ok_worm_lead()}</Button>
	{/if}
</Card>
