<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import Pointer from 'lucide-svelte/icons/pointer';
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
		promotion?: string;
		children?: Snippet;
	};

	let {
		name,
		priceUnitAmount,
		promotion,
		currency,
		showYearlyPrice,
		billingInfo,
		children,
		...rest
	}: Props & SvelteHTMLElements['div'] = $props();

	const planContent = getPlanContents(name);
</script>

{#snippet renderPrice(amount: null | number, currency: string)}
	<div class="text-3xl font-bold">
		{formatCurrency(Number(amount) / 100 / (showYearlyPrice ? 12 : 1), currency)}
	</div>
{/snippet}

<div
	class={cn(
		'bg-card border-border relative row-span-4 mt-6 grid grid-rows-subgrid gap-4 rounded border p-4',
		rest.class,
		promotion ? 'border-primary rounded-t-none' : ''
	)}
>
	{#if promotion}
		<div
			class="bg-primary text-primary-foreground absolute -right-[1px] bottom-full -left-[1px] flex items-center rounded-t-lg px-4 py-1"
		>
			<Pointer class="h-4 w-4 rotate-90" />
			<span class="ms-2 text-sm">
				{promotion}
			</span>
		</div>
	{/if}
	<h4 class="text-sm">{name}</h4>
	<div>
		{#if priceUnitAmount && currency}
			{@render renderPrice(priceUnitAmount, currency)}
			<div class="text-sm">{m.sunny_such_cod_shine()}</div>
		{:else}
			<div class="text-3xl font-bold">Free</div>
			<div class="text-sm">forever</div>
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
