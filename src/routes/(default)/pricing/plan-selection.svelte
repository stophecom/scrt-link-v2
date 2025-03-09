<script lang="ts">
	import { Check } from 'lucide-svelte';
	import { Stripe } from 'stripe';

	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import getStripe from '$lib/client/stripe';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { formatCurrency } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../$types';
	import type { Plan } from '../../api/v1/plans/+server';
	import CurrencySwitcher from './currency-switcher.svelte';
	import PlanView from './plan.svelte';

	type Props = {
		plans: Plan[];
		user: LayoutServerData['user'];
		subscription: Stripe.Subscription | null;
		stripePortalUrl: string | null;
	};
	let { plans, user, subscription, stripePortalUrl }: Props = $props();

	let showYearlyPrice = $state(true);

	const isSubscriptionActive =
		subscription?.status === 'active' || subscription?.status === 'trialing'; // We don't have trials, but include it be future-proof.
	const isSubscriptionCanceled = isSubscriptionActive && !!subscription?.cancel_at;

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
	plans.sort((a, b) => {
		if (a.prices.monthly.unit_amount && b.prices.monthly.unit_amount) {
			if (a?.prices.monthly.unit_amount < b.prices.monthly.unit_amount) {
				return -1;
			} else {
				return 1;
			}
		}
		return 1;
	});

	const handleSubmit = async (priceId: string) => {
		if (!user) {
			await goto('/signup');
		}
		try {
			// If customer has a subscription, update it.
			if (subscription?.status === 'active') {
				throw new Error('User has active subscription. Update on Stripe.');
			}

			// Create a Checkout Session.
			const response = await api<Stripe.Subscription>(
				`/plans/checkout`,
				{ method: 'POST' },
				{
					priceId: priceId
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
		} catch (e) {
			console.error(e);
		}
	};
</script>

{#if isSubscriptionActive && !isSubscriptionCanceled && stripePortalUrl}
	<Alert variant="info" title="You have an active subscription." class="mb-10 text-pretty"
		>{m.blue_livid_lobster_fulfill()}
		<div class="mt-4">
			<Button href={stripePortalUrl} target="_blank">{m.polite_super_antelope_lock()}</Button>
		</div>
	</Alert>
{/if}

{#if isSubscriptionCanceled && stripePortalUrl}
	<Alert variant="destructive" title="Subscription canceled" class="mb-10 text-pretty"
		>{m.last_jolly_stork_gasp()}
		<div class="mt-4">
			<Button href={stripePortalUrl} target="_blank">{m.polite_super_antelope_lock()}</Button>
		</div>
	</Alert>
{/if}
<div class="lg:-mx-20">
	<div class="grid gap-3 sm:grid-cols-3 lg:gap-4">
		<PlanView name="Confidential" class="mb-6 sm:mb-0">
			{#if user}
				<Button variant="outline" disabled class="w-full">
					<Check />
				</Button>
			{:else}
				<Button class="w-full" href="/signup">
					{m.major_next_meerkat_believe()}
				</Button>
			{/if}
		</PlanView>

		{#each plans as plan, index}
			{@const prices = plan.prices}
			{@const price = showYearlyPrice ? prices?.yearly : prices?.monthly}
			{@const currency = price?.currency}
			{@const priceUnitAmount = price?.unit_amount || 0}
			{@const priceId = price.id}
			{@const promotion = index === 0 ? 'Ideal for most people' : undefined}

			<PlanView
				name={plan.name}
				{showYearlyPrice}
				{priceUnitAmount}
				currency={price?.currency}
				{promotion}
				billingInfo={price.recurring?.interval === 'year'
					? m.alert_heroic_haddock_dare({
							amount: formatCurrency(priceUnitAmount / 100, currency)
						})
					: m.slow_frail_hare_empower({
							amount: formatCurrency(priceUnitAmount / 100, currency)
						})}
			>
				{#if !subscription && priceId !== 'free'}
					<Button class="w-full" onclick={() => handleSubmit(priceId)}
						>{m.major_next_meerkat_believe()}</Button
					>
				{/if}
			</PlanView>
		{/each}
	</div>

	<div class="flex flex-wrap">
		<div class="xs:flex mr-4 items-center py-4">
			<div class="xs:mb-0 mr-2 mb-1 font-medium">{m.novel_level_florian_kiss()}</div>
			<CurrencySwitcher />
		</div>
		<div class="xs:flex items-center py-4">
			<div class="xs:mb-0 mr-2 mb-1 font-medium">{m.cool_small_hornet_mix()}</div>
			<div class="flex items-center text-sm">
				{m.noisy_late_mouse_amaze()}
				<Switch bind:checked={showYearlyPrice} class="mx-2" />
				{m.day_even_beaver_cry({ percentage: yearlyPlanSavings })}
			</div>
		</div>
	</div>
</div>
