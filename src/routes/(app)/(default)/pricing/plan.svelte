<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Info from '@lucide/svelte/icons/info';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import Markdown from '$lib/components/ui/markdown/markdown.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { type SupportedCurrency } from '$lib/data/enums';
	import { getPlanContents, type PlanContentItem } from '$lib/data/plans';
	import { formatCurrency } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';

	type Props = {
		name: string;
		priceUnitAmount?: number;
		monthlyPriceUnitAmount?: number;
		seatPriceUnitAmount?: number;
		currency?: SupportedCurrency;
		billingInfo?: string;
		showYearlyPrice?: boolean;
		isActiveProduct?: boolean;
		hidePromotion?: boolean;
		priceLabel?: string;
		priceSublabel?: string;
		children?: Snippet;
	};

	let {
		name,
		priceUnitAmount,
		monthlyPriceUnitAmount,
		seatPriceUnitAmount,
		currency,
		billingInfo,
		showYearlyPrice,
		isActiveProduct,
		hidePromotion,
		priceLabel,
		priceSublabel,
		children,
		...rest
	}: Props & SvelteHTMLElements['div'] = $props();

	const planContent = getPlanContents(name);
	const contents = planContent.contents as PlanContentItem[];
</script>

{#snippet renderPrice(amount: null | number, currency: string)}
	<div class="text-3xl font-extrabold">
		{formatCurrency(Number(amount) / 100 / (showYearlyPrice ? 12 : 1), currency)}
	</div>
{/snippet}

<div
	class={cn(
		'bg-card border-border relative row-span-4 grid grid-rows-subgrid gap-4 border p-4 shadow-sm',
		rest.class,
		isActiveProduct ? 'border-primary' : ''
	)}
>
	<div class="pe-8 pb-1">
		<h4 class="mb-0.5 text-sm font-medium">
			{name}
			{#if planContent.promotion && !hidePromotion}
				<span
					class="bg-foreground text-background ms-2 inline-flex origin-left scale-75 items-center rounded-full px-3 py-1 text-xs"
				>
					{planContent.promotion}
				</span>
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
			<div class="text-sm">
				{m.sunny_such_cod_shine()}
			</div>
			{#if seatPriceUnitAmount && currency}
				<div class="text-sm">
					+ {formatCurrency(seatPriceUnitAmount / 100 / (showYearlyPrice ? 12 : 1), currency)}
					{m.slim_keen_ant_bill()}
				</div>
			{/if}
		{:else}
			<div class="text-3xl font-bold">{priceLabel ?? m.inner_pretty_raven_dine()}</div>
			<div class="text-sm">{priceSublabel ?? m.weak_witty_alligator_foster()}</div>
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
			{#each contents as item, i (i)}
				<li class="flex items-center py-1 text-sm">
					<Check class="text-primary mr-2 h-4 w-4 shrink-0" />
					<Markdown markdown={item.label} />
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
