<script lang="ts">
	import { Palette } from '@lucide/svelte';

	import AndroidFrame from '$lib/components/blocks/android-frame.svelte';
	import UpgradeNotice from '$lib/components/blocks/upgrade-notice.svelte';
	import WhiteLabelDomainForm from '$lib/components/forms/white-label-domain-form.svelte';
	import WhiteLabelForm from '$lib/components/forms/white-label-form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import Stepper from '$lib/components/ui/stepper';
	import { getUserPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let planLimits = $derived(getUserPlanLimits(data.user?.subscriptionTier));
	let hasDomain = $derived(!!data.whiteLabelDomain);
	let hasAccessControl = $derived(!!data.whiteLabel?.updatedAt);
	let isPublished = $derived(!!data.whiteLabel?.published);
	let currentStep = $derived(!hasDomain ? 0 : !hasAccessControl ? 1 : 2);
</script>

{#if planLimits.whiteLabel}
	<Stepper
		steps={[
			{ label: m.flat_warm_fox_setup(), completed: hasDomain },
			{ label: m.warm_swift_eagle_build(), completed: hasAccessControl },
			{ label: m.flat_warm_fox_design(), completed: isPublished }
		]}
		{currentStep}
		class="mb-8"
	/>

	<Card class="mb-6" title={'1. ' + m.flat_warm_fox_setup()}>
		<WhiteLabelDomainForm
			form={data.whiteLabelDomainForm}
			whiteLabelDomain={data.whiteLabelDomain}
		/>
	</Card>

	{#if hasDomain}
		<Card class="mb-6" title={'2. ' + m.warm_swift_eagle_build()}>
			<WhiteLabelForm
				organizationIdOptions={data.organizationIdOptions}
				form={data.whiteLabelForm}
			/>
		</Card>

		<div class="customize-card border-rainbow relative mb-6 rounded-lg p-0.5">
			<div
				class="bg-background relative grid grid-cols-[minmax(60%,1fr)_auto] overflow-hidden rounded-lg"
			>
				<div class="flex flex-col justify-center px-4 py-8 md:p-10">
					<h2 class="mt-2 mr-8 mb-2 text-2xl font-bold text-pretty md:text-3xl">
						3. {m.clear_warm_panda_glow()}
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
{:else}
	<UpgradeNotice tier={data.user?.subscriptionTier} class="mb-6" />
	<Button variant="outline" href={localizeHref('/business')}>{m.fit_ok_worm_lead()}</Button>
{/if}

<style>
	app .customize-card :global(.caseBorder) {
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
