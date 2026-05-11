<script lang="ts">
	import Check from '@lucide/svelte/icons/check-circle';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import { Stripe } from 'stripe';
	import { toast } from 'svelte-sonner';

	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { api } from '$lib/api';
	import { TRIAL_PERIOD_DAYS } from '$lib/client/constants';
	import getStripe from '$lib/client/stripe';
	import Button from '$lib/components/ui/button/button.svelte';
	import { SupportedCurrency, TierOptions } from '$lib/data/enums';
	import { formatCurrency } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { Plan } from '../../../api/v1/plans/+server';
	import type { LayoutServerData } from '../../$types';
	import PlanView from './plan.svelte';

	type Props = {
		plans: Plan[];
		user: LayoutServerData['user'];
		orgId: string | null;
		orgSubscription: Stripe.Subscription | null;
		currency: SupportedCurrency;
		showYearlyPrice: boolean;
	};
	let { plans, user, orgId, orgSubscription, currency, showYearlyPrice }: Props = $props();

	const isOrgSubscriptionCanceled = orgSubscription && !!orgSubscription?.cancel_at;
	const activeOrgProduct = $derived(orgSubscription?.items.data[0].plan.product);

	const orgPlanNames = [TierOptions.SECRET_SERVICE, TierOptions.TOP_SECRET_SERVICE];
	const businessPlans = $derived(
		plans
			.filter((p) => orgPlanNames.includes(p.name as TierOptions))
			.sort((a, b) => {
				const aAmount = a.prices.monthly?.unit_amount ?? 0;
				const bAmount = b.prices.monthly?.unit_amount ?? 0;
				return aAmount - bAmount;
			})
	);

	const handleSubmit = async (priceId: string) => {
		if (!user) {
			await goto(resolve('/signup'));
			return;
		}
		if (!orgId) {
			await goto(localizeHref('/account/organization'));
			return;
		}
		try {
			if (orgSubscription?.status && ['active', 'trialing'].includes(orgSubscription.status)) {
				const response = await api<{ message: string }>(
					`/plans/checkout`,
					{ method: 'PUT' },
					{ priceId, subscriptionId: orgSubscription.id, orgId }
				);
				await invalidateAll();
				toast.success(response.message);
			} else {
				const response = await api<Stripe.Checkout.Session>(
					`/plans/checkout`,
					{ method: 'POST' },
					{ priceId, currency, orgId }
				);
				const stripe = await getStripe();
				const { error } = await stripe!.redirectToCheckout({ sessionId: response.id });
				if (error) throw new Error(error.message as string);
			}
		} catch (e) {
			console.error(e);
		}
	};
</script>

{#snippet renderIsActivePlan()}
	<p class="text-success text-sm font-semibold">
		<Check class="mb-2" />{m.shy_clean_frog_belong()}
	</p>
{/snippet}

<div class="grid gap-6 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-3 lg:-mx-4 xl:-mx-24">
	{#each businessPlans as plan (plan.id)}
		{@const prices = plan.prices}
		{@const isActiveProduct = plan.id === activeOrgProduct}
		{@const price = showYearlyPrice ? prices?.yearly : prices?.monthly}
		{@const priceUnitAmount = price?.currency_options[currency]?.unit_amount || 0}
		{@const monthlyPriceUnitAmount = prices?.monthly?.currency_options[currency]?.unit_amount || 0}
		{@const priceId = price.id}

		<PlanView
			name={plan.name}
			{showYearlyPrice}
			{priceUnitAmount}
			{monthlyPriceUnitAmount}
			{currency}
			isOrgPlan={true}
			{isActiveProduct}
			billingInfo={price.recurring?.interval === 'year'
				? m.alert_heroic_haddock_dare({
						amount: formatCurrency(priceUnitAmount / 100, currency)
					})
				: m.slow_frail_hare_empower({
						amount: formatCurrency(priceUnitAmount / 100, currency)
					})}
		>
			{#if !orgSubscription || isOrgSubscriptionCanceled}
				<Button class="w-full" onclick={() => handleSubmit(priceId)}>
					{m.noisy_safe_moth_mop()}
				</Button>
				<div class="py-1 text-center text-xs">
					{m.early_vexed_slug_mend({ amount: TRIAL_PERIOD_DAYS })}
				</div>
			{:else if isActiveProduct}
				{@render renderIsActivePlan()}
				{#if orgSubscription?.cancel_at}
					<p class="text-destructive text-sm">
						Cancels {new Date(orgSubscription.cancel_at * 1000).toLocaleDateString()}
					</p>
				{/if}
			{:else}
				<Button class="w-full" onclick={() => handleSubmit(priceId)}>Select plan</Button>
				<div class="py-1 text-center text-xs">
					{m.civil_formal_firefox_surge({ planName: plan.name })}
				</div>
			{/if}
		</PlanView>
	{/each}

	<!-- Talk to us card -->
	<div class="bg-card border-border row-span-4 grid grid-rows-subgrid gap-4 border p-4 shadow-sm">
		<div class="pb-1">
			<h4 class="mb-0.5 text-sm font-medium">{m.soft_tame_moth_ping()}</h4>
			<p class="text-muted-foreground text-xs">{m.brave_cool_bear_roam()}</p>
		</div>
		<MessageCircle class="text-muted-foreground h-6 w-6" />
		<div>
			<div class="text-3xl font-bold">{m.inner_pretty_raven_dine()}</div>
			<div class="text-sm">{m.weak_witty_alligator_foster()}</div>
		</div>
		<div class="py-4">
			<Button class="w-full" variant="outline" href={localizeHref('/contact')}>
				{m.acidic_extra_vulture_enchant()}
			</Button>
		</div>
		<div>
			<p class="text-muted-foreground text-sm">{m.keen_flat_dove_step()}</p>
		</div>
	</div>
</div>
