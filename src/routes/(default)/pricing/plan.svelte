<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import { getPlanContents } from '$lib/data/plans';
	import { formatCurrency } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		name: string;
		priceUnitAmount?: number;
		currency?: string;
		billingInfo?: string;
		showYearlyPrice?: boolean;
		isActiveProduct?: boolean;
		hidePromotion?: boolean;
		children?: Snippet;
	};

	let {
		name,
		priceUnitAmount,
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
		'bg-card border-border relative row-span-4 grid grid-rows-subgrid gap-4 rounded border p-4',
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

	<h4 class="mb-1 text-sm font-medium">{name}</h4>
	<planContent.icon class={cn('absolute top-4 right-4', isActiveProduct ? 'text-primary' : '')} />
	<div>
		{#if priceUnitAmount && currency}
			{@render renderPrice(priceUnitAmount, currency)}
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
			{#each planContent.contents as item}
				<li class="flex items-center py-1 text-sm">
					<Check class="text-primary mr-2 h-4 w-4" />{item}
				</li>
			{/each}
		</ul>
	</div>
</div>
