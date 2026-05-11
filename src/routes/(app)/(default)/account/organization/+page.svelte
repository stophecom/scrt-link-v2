<script lang="ts">
	import { ExternalLink, Palette, Receipt } from '@lucide/svelte';

	import AndroidFrame from '$lib/components/blocks/android-frame.svelte';
	import UpgradeNotice from '$lib/components/blocks/upgrade-notice.svelte';
	import WhiteLabelForm from '$lib/components/forms/white-label-form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import Stepper from '$lib/components/ui/stepper';
	import { getUserPlanLimits } from '$lib/data/plans';
	import { formatCurrency, formatDate } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { LayoutData } from '../$types';
	import OrganizationCard from '../organization-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData & LayoutData } = $props();
	let planLimits = $derived(getUserPlanLimits(data.user?.subscriptionTier));
	let hasOrg = $derived(!!data.userOrganization);
	let hasDomain = $derived(!!data.whiteLabelDomain);
	let isPublished = $derived(!!data.whiteLabel?.published);
	let currentStep = $derived(!hasOrg ? 0 : !hasDomain ? 1 : 2);
</script>

<Stepper
	steps={[
		{ label: m.bold_neat_panda_learn(), completed: hasOrg },
		{ label: m.warm_swift_eagle_build(), completed: hasDomain },
		{ label: m.bright_keen_fox_paint(), completed: isPublished }
	]}
	{currentStep}
	class="mb-8"
/>

<OrganizationCard
	user={data.user}
	organization={data.userOrganization}
	organizationForm={data.organizationForm}
	inviteOrganizationMemberForm={data.inviteOrganizationMemberForm}
	manageOrganizationMemberForm={data.manageOrganizationMemberForm}
/>

{#if hasOrg}
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
{/if}

{#if data.userOrganization?.role === 'Owner'}
	<Card class="mb-6" title={m.misty_teal_hawk_glow()}>
		{#if data.orgSubscription}
			{@const sub = data.orgSubscription}
			{@const item = sub.items.data[0]}
			{@const interval = item.price.recurring?.interval}
			{@const amount = item.price.unit_amount ?? 0}
			{@const currency = item.price.currency}
			<div class="mb-4 flex flex-wrap gap-6">
				<div>
					<p class="text-muted-foreground text-xs uppercase">{m.novel_proud_anaconda_zoom()}</p>
					<p class="font-medium">
						{sub.items.data[0].price.nickname ?? data.userOrganization.name}
					</p>
					<span class="text-xs capitalize">{sub.status}</span>
				</div>
				<div>
					<p class="text-muted-foreground text-xs uppercase">{m.busy_teal_elk_nod()}</p>
					<p class="font-medium">
						{formatDate(new Date(sub.current_period_end * 1000))}
					</p>
				</div>
				<div>
					<p class="text-muted-foreground text-xs uppercase">{m.short_plain_mole_rush()}</p>
					<p class="font-medium">
						{formatCurrency(amount / 100, currency)} / {interval} / seat
					</p>
				</div>
			</div>

			{#if data.orgInvoices.length}
				<h4 class="text-muted-foreground mb-2 text-xs font-semibold uppercase">
					{m.pale_flat_ox_zoom()}
				</h4>
				<ul class="mb-4 divide-y text-sm">
					{#each data.orgInvoices as invoice (invoice.id)}
						<li class="flex items-center justify-between py-2">
							<span>{formatDate(new Date(invoice.created * 1000))}</span>
							<span>{formatCurrency((invoice.amount_paid ?? 0) / 100, invoice.currency)}</span>
							<span class="capitalize">{invoice.status}</span>
							{#if invoice.invoice_pdf}
								<a
									href={invoice.invoice_pdf}
									target="_blank"
									rel="noopener noreferrer"
									class="text-primary flex items-center gap-1 text-xs"
								>
									PDF <ExternalLink class="h-3 w-3" />
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-muted-foreground mb-4 text-sm">{m.zeal_fair_elk_drop()}</p>
			{/if}

			{#if data.stripePortalUrl}
				<Button variant="outline" href={data.stripePortalUrl}>
					<Receipt class="me-2 h-4 w-4" />
					{m.dull_tame_crow_hike()}
				</Button>
			{/if}
		{:else}
			<p class="text-muted-foreground mb-4 text-sm">{m.gold_calm_fox_sing()}</p>
			<Button variant="outline" href={localizeHref('/pricing')}>{m.cute_witty_puffin_grow()}</Button
			>
		{/if}
	</Card>
{/if}

{#if hasDomain}
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
