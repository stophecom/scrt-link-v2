<script lang="ts">
	import Check from 'lucide-svelte/icons/check-circle';
	import { PersistedState } from 'runed';
	import { Stripe } from 'stripe';
	import { toast } from 'svelte-sonner';

	import { goto, invalidateAll } from '$app/navigation';
	import { api } from '$lib/api';
	import PoweredByStripe from '$lib/assets/images/PoweredByStripe.svg?component';
	import { TRIAL_PERIOD_DAYS } from '$lib/client/constants';
	import getStripe from '$lib/client/stripe';
	import { type Variant } from '$lib/components/ui/alert';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { SupportedCurrency } from '$lib/data/enums';
	import { formatCurrency, formatDate } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';

	import type { Plan } from '../../../api/v1/plans/+server';
	import type { LayoutServerData } from '../../$types';
	import CurrencySwitcher from './currency-switcher.svelte';
	import PlanView from './plan.svelte';

	type Props = {
		plans: Plan[];
		user: LayoutServerData['user'];
		subscription: Stripe.Subscription | null;
	};
	let { plans, user, subscription }: Props = $props();

	let showYearlyPrice = $state(true);

	// Negotiate default currency
	const locale = getLocale();
	const currency = new PersistedState<SupportedCurrency>(
		'currency',
		locale === 'fr' || locale === 'de' ? SupportedCurrency.EUR : SupportedCurrency.USD
	);

	const isSubscriptionCanceled = subscription && !!subscription?.cancel_at;

	// We assume a subscription has only one plan associated with it.
	const activeProduct = $derived(subscription?.items.data[0].plan.product);

	// Get % yearly savings. We take first plan. (There should be only one)
	const premiumPlanPrices = plans.length && plans[0].prices;
	const yearlyPlanSavings =
		premiumPlanPrices &&
		premiumPlanPrices?.yearly?.unit_amount &&
		premiumPlanPrices?.monthly?.unit_amount &&
		Math.floor(
			(1 - premiumPlanPrices.yearly.unit_amount / 12 / premiumPlanPrices.monthly.unit_amount) * 100
		);
	// Sort plans based on price
	let plansSorted = $derived(
		plans.sort((a, b) => {
			if (a.prices.monthly.unit_amount && b.prices.monthly.unit_amount) {
				if (a?.prices.monthly.unit_amount < b.prices.monthly.unit_amount) {
					return -1;
				} else {
					return 1;
				}
			}
			return 1;
		})
	);

	const handleSubmit = async (priceId: string) => {
		if (!user) {
			await goto('/signup');
		}
		try {
			// If customer has a subscription, update it.
			if (subscription?.status && ['active', 'trialing'].includes(subscription.status)) {
				// Create a Checkout Session.
				const response = await api<{ message: string }>(
					`/plans/checkout`,
					{ method: 'PUT' },
					{
						priceId: priceId,
						subscriptionId: subscription.id
					}
				);
				await invalidateAll();

				toast.success(response.message);
			} else {
				// Create a Checkout Session.
				const response = await api<Stripe.Subscription>(
					`/plans/checkout`,
					{ method: 'POST' },
					{
						priceId: priceId,
						currency: currency.current
					}
				);
				// Redirect to Checkout.
				const stripe = await getStripe();
				const { error } = await stripe!.redirectToCheckout({
					// Make the id field from the Checkout Session creation API response
					// available to this file, so you can provide it as parameter here
					// instead of the {{CHECKOUT_SESSION_ID}} placeholder.
					sessionId: response.id
				});

				if (error) {
					throw new Error(error.message as string);
				}
			}
		} catch (e) {
			console.error(e);
		}
	};
</script>

{#snippet subscriptionInfo(variant: Variant, title: string, description: string)}
	<Alert {variant} {title} class="mb-10 text-pretty">
		{description}
		<form class="mt-2 block" method="post" action="?/manageSubscriptionOnStripe">
			<Button variant="link" type="submit">{m.polite_super_antelope_lock()}</Button>
		</form>
	</Alert>
{/snippet}

{#snippet renderIsActivePlan()}
	<p class="text-success text-sm font-semibold">
		<Check class="mb-2" />{m.shy_clean_frog_belong()}
	</p>
{/snippet}

{#if subscription && !isSubscriptionCanceled}
	{@render subscriptionInfo('info', m.honest_witty_whale_pout(), m.blue_livid_lobster_fulfill())}
{/if}

{#if isSubscriptionCanceled}
	{@render subscriptionInfo('destructive', m.aware_tangy_giraffe_dial(), m.last_jolly_stork_gasp())}
{/if}

<div>
	<div class="grid gap-6 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 md:gap-3 lg:-mx-4 xl:-mx-24">
		<PlanView name="Confidential">
			{#if !user}
				<Button class="w-full" href={localizeHref('/signup')}>{m.lofty_tasty_ray_fond()}</Button>
			{:else if user && !subscription}
				{@render renderIsActivePlan()}
			{/if}
		</PlanView>

		{#each plansSorted as plan}
			{@const prices = plan.prices}
			{@const isActiveProduct = plan.id === activeProduct}
			{@const price = showYearlyPrice ? prices?.yearly : prices?.monthly}
			{@const priceUnitAmount = price?.currency_options[currency.current]?.unit_amount || 0}
			{@const priceId = price.id}

			<PlanView
				name={plan.name}
				{showYearlyPrice}
				{priceUnitAmount}
				currency={currency.current}
				hidePromotion={!!subscription}
				{isActiveProduct}
				billingInfo={price.recurring?.interval === 'year'
					? m.alert_heroic_haddock_dare({
							amount: formatCurrency(priceUnitAmount / 100, currency.current)
						})
					: m.slow_frail_hare_empower({
							amount: formatCurrency(priceUnitAmount / 100, currency.current)
						})}
			>
				{#if !subscription}
					<Button class="w-full" onclick={() => handleSubmit(priceId)}
						>{m.noisy_safe_moth_mop()}</Button
					>
					<div class="py-1 text-center text-xs">
						{m.early_vexed_slug_mend({ amount: TRIAL_PERIOD_DAYS })}
					</div>
				{:else if isActiveProduct}
					{@render renderIsActivePlan()}
					{#if subscription?.cancel_at}
						<p class="text-destructive text-sm">
							{m.fair_true_moth_commend({
								date: formatDate(new Date(subscription.cancel_at * 1000))
							})}
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
	</div>

	<div class="flex flex-col flex-wrap items-center sm:flex-row">
		<div class="xs:flex mr-4 items-center py-4">
			<CurrencySwitcher bind:activeCurrency={currency.current} />
		</div>
		<div class="xs:flex items-center py-4">
			<div class="flex items-center text-sm">
				{m.noisy_late_mouse_amaze()}
				<Switch bind:checked={showYearlyPrice} class="mx-2" />
				{m.day_even_beaver_cry({ percentage: yearlyPlanSavings || 0 })}
			</div>
		</div>
		<div class="flex items-center py-4 sm:ms-auto"><PoweredByStripe class="w-[160px]" /></div>
	</div>
</div>
