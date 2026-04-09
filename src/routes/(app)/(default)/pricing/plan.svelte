<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Info from '@lucide/svelte/icons/info';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { type SupportedCurrency, TierOptions } from '$lib/data/enums';
	import { getPlanContents } from '$lib/data/plans';
	import { formatCurrency } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';

	type Props = {
		name: string;
		priceUnitAmount?: number;
		monthlyPriceUnitAmount?: number;
		currency?: SupportedCurrency;
		billingInfo?: string;
		showYearlyPrice?: boolean;
		isActiveProduct?: boolean;
		hidePromotion?: boolean;
		children?: Snippet;
	};

	let {
		name,
		priceUnitAmount,
		monthlyPriceUnitAmount,
		currency,
		billingInfo,
		showYearlyPrice,
		isActiveProduct,
		hidePromotion,
		children,
		...rest
	}: Props & SvelteHTMLElements['div'] = $props();

	const planContent = getPlanContents(name);
</script>

{#snippet renderPrice(amount: null | number, currency: string)}
	<div class="text-3xl font-extrabold">
		{formatCurrency(Number(amount) / 100 / (showYearlyPrice ? 12 : 1), currency)}
	</div>
{/snippet}

<div
	class={cn(
		'bg-background border-border relative row-span-4 grid grid-rows-subgrid gap-4 border p-4 shadow-sm',
		rest.class,
		planContent.promotion && !hidePromotion ? 'border-foreground mt-6 rounded-t-none sm:mt-0' : '',
		isActiveProduct ? 'border-primary' : ''
	)}
>
	{#if planContent.promotion && !hidePromotion}
		<div
			class="bg-foreground text-background absolute -right-[1px] bottom-full -left-[1px] flex items-center rounded-t-lg px-4 py-1 text-sm"
		>
			{planContent.promotion}
		</div>
	{/if}

	<div class="pe-8 pb-1">
		<h4 class="mb-0.5 text-sm font-medium">
			<span class="me-2">{name}</span>
			{#if name === TierOptions.SECRET_SERVICE}
				<span class="bg-foreground text-background inline-flex rounded-md px-2 py-1 text-xs"
					>business</span
				>
			{/if}
		</h4>
		{#if planContent.subtitle}
			<p class="text-muted-foreground text-xs">{planContent.subtitle}</p>
		{/if}
	</div>
	<planContent.icon class={cn('absolute top-4 right-4', isActiveProduct ? 'text-primary' : '')} />
	<div>
		{#if priceUnitAmount && currency}
			<div class="flex items-baseline gap-2">
				{@render renderPrice(priceUnitAmount, currency)}
				{#if showYearlyPrice && monthlyPriceUnitAmount}
					<span class="text-muted-foreground text-sm line-through">
						{formatCurrency(monthlyPriceUnitAmount / 100, currency)}
					</span>
				{/if}
			</div>
			<div class="text-sm">{m.sunny_such_cod_shine()}</div>
		{:else}
			<div class="text-3xl font-bold">{m.inner_pretty_raven_dine()}</div>
			<div class="text-sm">{m.weak_witty_alligator_foster()}</div>
		{/if}
		<div class="text-sm">
			{billingInfo}
		</div>
	</div>

	<div class="py-4">
		{@render children?.()}
	</div>

	<div>
		<h5 class="mb-3 text-xs font-semibold uppercase">{planContent.title}</h5>
		<ul>
			{#each planContent.contents as item, i (i)}
				<li class="flex items-center py-1 text-sm">
					<Check class="text-primary mr-2 h-4 w-4 shrink-0" />{item.label}
					{#if item.tooltip}
						<Tooltip.Root delayDuration={0}>
							<Tooltip.Trigger
								class="-m-2 ml-0 inline-flex shrink-0 cursor-help p-2"
								onclick={(e: MouseEvent) => {
									e.preventDefault();
									const trigger = e.currentTarget as HTMLElement;
									trigger.focus();
								}}
							>
								<Info class="text-muted-foreground h-3.5 w-3.5" />
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p class="max-w-48">{item.tooltip}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>
