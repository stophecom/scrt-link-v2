<script lang="ts">
	import Check from '@lucide/svelte/icons/check-circle';
	import { Stripe } from 'stripe';
	import { toast } from 'svelte-sonner';

	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { api } from '$lib/api';
	import { TRIAL_PERIOD_DAYS } from '$lib/client/constants';
	import getStripe from '$lib/client/stripe';
	import Button from '$lib/components/ui/button/button.svelte';
	import { SupportedCurrency, TierOptions } from '$lib/data/enums';
	import { formatDate } from '$lib/i18n';
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
		isOrgOwner: boolean;
	};
	let { plans, user, orgId, orgSubscription, currency, isOrgOwner }: Props = $props();

	const isOrgSubscriptionCanceled = orgSubscription && !!orgSubscription?.cancel_at;
	const activeOrgProduct = $derived(
		orgSubscription?.items.data.find((item) => plans.some((p) => p.id === item.plan.product))?.plan
			.product
	);

	const orgPlanNames = [TierOptions.SECRET_SERVICE, TierOptions.TOP_SECRET_SERVICE];
	const businessPlans = $derived(
		plans
			.filter((p) => orgPlanNames.includes(p.name as TierOptions))
			.sort((a, b) => {
				const aAmount = a.basePrices?.monthly?.unit_amount ?? a.prices.monthly?.unit_amount ?? 0;
				const bAmount = b.basePrices?.monthly?.unit_amount ?? b.prices.monthly?.unit_amount ?? 0;
				return aAmount - bAmount;
			})
	);

	const handleSubmit = async (priceId: string, basePriceId?: string) => {
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
					{ priceId, subscriptionId: orgSubscription.id, orgId, basePriceId }
				);
				toast.success(response.message);
				await invalidateAll();
			} else {
				const response = await api<Stripe.Checkout.Session>(
					`/plans/checkout`,
					{ method: 'POST' },
					{ priceId, currency, orgId, basePriceId }
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

<div class="grid gap-6 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-3">
	{#each businessPlans as plan (plan.id)}
		{@const prices = plan.prices}
		{@const isActiveProduct = plan.id === activeOrgProduct}
		{@const price = prices?.monthly}
		{@const hasSelectedCurrency = !!price?.currency_options?.[currency]?.unit_amount}
		{@const priceUnitAmount = hasSelectedCurrency
			? (price.currency_options[currency].unit_amount ?? 0)
			: (price?.unit_amount ?? 0)}
		{@const displayCurrency = hasSelectedCurrency
			? currency
			: ((price?.currency ?? currency) as SupportedCurrency)}
		{@const priceId = price.id}
		{@const basePrice = plan.basePrices?.monthly}
		{@const basePriceUnitAmount =
			basePrice?.currency_options?.[currency]?.unit_amount ?? basePrice?.unit_amount ?? 0}
		{@const basePriceId = basePrice?.id}
		{@const displayPriceUnitAmount = basePriceUnitAmount || priceUnitAmount}

		<PlanView
			name={plan.name}
			priceUnitAmount={displayPriceUnitAmount || undefined}
			seatPriceUnitAmount={basePriceUnitAmount ? priceUnitAmount || undefined : undefined}
			currency={displayCurrency}
			{isActiveProduct}
		>
			{#if !isOrgOwner}
				<p class="text-muted-foreground text-center text-sm">{m.flat_warm_checkout_owner_only()}</p>
			{:else if !orgSubscription || isOrgSubscriptionCanceled}
				<Button class="w-full" onclick={() => handleSubmit(priceId, basePriceId)}>
					{m.noisy_safe_moth_mop()}
				</Button>
				<div class="py-1 text-center text-xs">
					{m.early_vexed_slug_mend({ amount: TRIAL_PERIOD_DAYS })}
				</div>
			{:else if isActiveProduct}
				{@render renderIsActivePlan()}
				{#if orgSubscription?.cancel_at}
					<p class="text-destructive text-sm">
						{m.flat_warm_fox_cancel({
							date: formatDate(new Date(orgSubscription.cancel_at * 1000))
						})}
					</p>
				{/if}
			{:else}
				<Button class="w-full" onclick={() => handleSubmit(priceId, basePriceId)}
					>{m.slim_bold_plan_pick()}</Button
				>
				<div class="py-1 text-center text-xs">
					{m.civil_formal_firefox_surge({ planName: plan.name })}
				</div>
			{/if}
		</PlanView>
	{/each}

	<PlanView
		name="Secret Enterprise"
		priceLabel={m.soft_tame_moth_ping()}
		priceSublabel={m.wise_bold_fox_deal()}
	>
		<Button class="w-full" variant="outline" href={localizeHref('/contact')}>
			{m.acidic_extra_vulture_enchant()}
		</Button>
	</PlanView>
</div>
