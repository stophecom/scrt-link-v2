<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import type { Stripe } from 'stripe';

	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import { formatCurrency, formatDate } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	type Props = {
		subscription: Stripe.Subscription | null;
		planName: string | null;
		stripePortalUrl: string | null;
		pricingHref?: string;
		seatCount?: number;
		monthlyAmountCents?: number;
		currency?: string;
		class?: string;
	};

	let {
		subscription,
		planName,
		stripePortalUrl,
		pricingHref,
		seatCount = 0,
		monthlyAmountCents = 0,
		currency = 'usd',
		class: className
	}: Props = $props();

	const statusLabel: Record<string, () => string> = {
		active: m.teal_keen_sub_active,
		trialing: m.teal_keen_sub_trial,
		canceled: m.teal_keen_sub_cancel,
		past_due: m.teal_keen_sub_due,
		unpaid: m.teal_keen_sub_unpaid,
		incomplete: m.teal_keen_sub_incomplete
	};

	const statusClass: Record<string, string> = {
		active: 'bg-success/15 text-success',
		trialing: 'bg-success/15 text-success',
		canceled: 'bg-destructive/15 text-destructive',
		past_due: 'bg-destructive/15 text-destructive',
		unpaid: 'bg-destructive/15 text-destructive',
		incomplete: 'bg-destructive/15 text-destructive'
	};
</script>

{#if subscription}
	<Card title={m.flat_warm_plan_current()} class={className}>
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<div class="mb-1 flex items-center gap-2">
					<div class="font-semibold">
						{planName ?? subscription.items.data[0]?.plan?.nickname ?? m.flat_warm_plan_label()}
					</div>
					<span
						class="rounded-full px-2 py-0.5 text-xs font-medium {statusClass[subscription.status] ??
							'bg-muted text-muted-foreground'}"
					>
						{statusLabel[subscription.status]?.() ?? subscription.status}
					</span>
				</div>
				{#if seatCount > 0}
					<div class="text-muted-foreground mb-4 flex gap-6">
						<div>
							<span class="text-foreground font-medium">{seatCount}</span>
							<span class="ml-1">{m.flat_warm_stat_seats()}</span>
						</div>
						{#if monthlyAmountCents > 0}
							<div>
								<span class="text-foreground font-medium"
									>{formatCurrency(monthlyAmountCents / 100, currency)}</span
								>
								<span class="ml-1">{m.flat_warm_stat_monthly()}</span>
							</div>
						{/if}
					</div>
				{/if}
				<p class="text-muted-foreground text-sm">
					{#if subscription.cancel_at}
						{m.flat_warm_fox_cancel({
							date: formatDate(new Date(subscription.cancel_at * 1000))
						})}
					{:else}
						{m.flat_warm_fox_renew({
							date: formatDate(new Date(subscription.current_period_end * 1000))
						})}
					{/if}
				</p>
			</div>
			{#if stripePortalUrl}
				<Button href={stripePortalUrl} target="_blank" variant="outline" size="sm">
					<ExternalLink class="mr-1.5 h-3.5 w-3.5" />
					{m.dull_tame_crow_hike()}
				</Button>
			{/if}
		</div>
	</Card>
{:else}
	<Card title={m.flat_warm_plan_current()}>
		<p class="text-muted-foreground mb-4">{m.flat_warm_bear_none()}</p>
		<Button href={pricingHref ?? localizeHref('/pricing')} variant="outline" size="sm">
			{m.flat_warm_plan_view()}
		</Button>
	</Card>
{/if}
