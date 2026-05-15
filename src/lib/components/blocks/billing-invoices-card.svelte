<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import type { Stripe } from 'stripe';

	import Card from '$lib/components/ui/card';
	import { formatCurrency, formatDate } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';

	type Props = {
		invoices: Stripe.Invoice[];
		class?: string;
	};

	let { invoices, class: className }: Props = $props();

	const invoiceStatusLabel: Record<string, () => string> = {
		paid: m.teal_keen_inv_paid,
		open: m.teal_keen_inv_open,
		draft: m.teal_keen_inv_draft,
		void: m.teal_keen_inv_void,
		uncollectible: m.teal_keen_inv_uncollectible
	};

	const invoiceStatusClass: Record<string, string> = {
		paid: 'bg-success/15 text-success',
		open: 'bg-destructive/15 text-destructive',
		draft: 'text-muted-foreground bg-muted',
		void: 'text-muted-foreground bg-muted',
		uncollectible: 'bg-destructive/15 text-destructive'
	};
</script>

<Card title={m.pale_flat_ox_zoom()} class={className}>
	{#if invoices.length === 0}
		<p class="text-muted-foreground">{m.zeal_fair_elk_drop()}</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-border border-b">
						<th class="text-muted-foreground pb-2 text-left font-medium"
							>{m.flat_warm_inv_date()}</th
						>
						<th class="text-muted-foreground pb-2 text-left font-medium"
							>{m.caring_topical_ray_commend()}</th
						>
						<th class="text-muted-foreground pb-2 text-left font-medium"
							>{m.real_proud_dolphin_attend()}</th
						>
						<th class="text-muted-foreground pb-2 text-right font-medium"
							>{m.flat_warm_inv_total()}</th
						>
						<th class="pb-2"></th>
					</tr>
				</thead>
				<tbody>
					{#each invoices as invoice (invoice.id)}
						{@const status = invoice.status ?? 'draft'}
						<tr class="border-border border-b last:border-0">
							<td class="py-3 pr-4">{formatDate(new Date(invoice.created * 1000))}</td>
							<td class="py-3 pr-4 capitalize"
								>{invoice.billing_reason?.replace(/_/g, ' ') ?? m.flat_warm_inv_label()}</td
							>
							<td class="py-3 pr-4">
								<span
									class="rounded-full px-2 py-0.5 text-xs font-medium {invoiceStatusClass[status] ??
										'bg-muted text-muted-foreground'}"
								>
									{invoiceStatusLabel[status]?.() ?? status}
								</span>
							</td>
							<td class="py-3 pr-4 text-right font-medium">
								{invoice.total != null
									? formatCurrency(invoice.total / 100, invoice.currency)
									: '—'}
							</td>
							<td class="py-3 text-right">
								{#if invoice.hosted_invoice_url}
									<a
										href={invoice.hosted_invoice_url}
										target="_blank"
										rel="noopener noreferrer"
										class="text-muted-foreground hover:text-foreground"
									>
										<ExternalLink class="h-3.5 w-3.5" />
									</a>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</Card>
