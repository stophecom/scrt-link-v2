<script lang="ts">
	import { Palette } from '@lucide/svelte';

	import AndroidFrame from '$lib/components/blocks/android-frame.svelte';
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
	title={m.watery_basic_lemur_tickle()}
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

{#if data.whiteLabelDomain}
	<div class="customize-card relative mb-6 rounded-lg p-0.5">
		<div
			class="bg-background relative grid grid-cols-[minmax(60%,1fr)_auto] overflow-hidden rounded-lg"
		>
			<!-- Left: Content -->
			<div class="flex flex-col justify-center px-4 py-8 md:p-10">
				<h2 class="mt-2 mr-8 mb-2 text-2xl font-bold text-pretty md:text-3xl">
					{m.clear_warm_panda_glow()}
				</h2>
				<p class="text-muted-foreground mb-6 text-pretty">
					{m.bright_calm_tiger_leap()}
				</p>
				<div>
					<Button href={localizeHref(`/account/secret-service/edit/${data.whiteLabelDomain}`)}>
						<Palette class="me-2 h-5 w-5" />
						{m.home_witty_piranha_peek()}
					</Button>
				</div>
			</div>

			<!-- Right: Preview (clipped) -->
			<div class="relative min-h-48 w-56 overflow-hidden lg:w-56">
				<div class="pointer-events-none absolute top-10 -right-12 left-0 h-75 origin-top">
					<AndroidFrame>
						<iframe
							title="Preview"
							src={`/white-label/${data.whiteLabelDomain}`}
							frameborder="0"
							class="iframe-zoomed"
						></iframe>
					</AndroidFrame>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.customize-card {
		background: conic-gradient(
			from 0deg,
			#f97316,
			#ef4444,
			#ec4899,
			#8b5cf6,
			#3b82f6,
			#06b6d4,
			#10b981,
			#f97316
		);
		box-shadow:
			0 4px 20px rgba(139, 92, 246, 0.15),
			0 8px 40px rgba(236, 72, 153, 0.1),
			0 2px 8px rgba(59, 130, 246, 0.12);
	}

	.customize-card :global(.caseBorder) {
		box-shadow:
			0 0 4px rgba(59, 130, 246, 0.2),
			0 0 8px rgba(139, 92, 246, 0.15),
			0 0 12px rgba(236, 72, 153, 0.1);
	}

	.customize-card :global(.iframe-zoomed) {
		width: 125%;
		height: 125%;
		transform: scale(0.8);
		transform-origin: top left;
	}
</style>
