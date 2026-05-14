<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';

	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { formatCurrency, formatDate } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let activeTab = $state('overview');

	const statusLabel: Record<string, string> = {
		active: 'Active',
		trialing: 'Trialing',
		canceled: 'Canceled',
		past_due: 'Past due',
		unpaid: 'Unpaid',
		incomplete: 'Incomplete'
	};

	const statusClass: Record<string, string> = {
		active: 'bg-success/15 text-success',
		trialing: 'bg-blue-100 text-blue-700',
		canceled: 'bg-destructive/15 text-destructive',
		past_due: 'bg-destructive/15 text-destructive',
		unpaid: 'bg-destructive/15 text-destructive',
		incomplete: 'bg-yellow-100 text-yellow-700'
	};

	const invoiceStatusLabel: Record<string, string> = {
		paid: 'Paid',
		open: 'Open',
		draft: 'Draft',
		void: 'Void',
		uncollectible: 'Uncollectible'
	};

	const invoiceStatusClass: Record<string, string> = {
		paid: 'bg-success/15 text-success',
		open: 'bg-yellow-100 text-yellow-700',
		draft: 'text-muted-foreground bg-muted',
		void: 'text-muted-foreground bg-muted',
		uncollectible: 'bg-destructive/15 text-destructive'
	};
</script>

<Tabs.Tabs bind:value={activeTab}>
	<Tabs.TabsList class="mb-2">
		<Tabs.TabsTrigger value="overview">{m.warm_flat_bear_view()}</Tabs.TabsTrigger>
		<Tabs.TabsTrigger value="invoices">{m.pale_flat_ox_zoom()}</Tabs.TabsTrigger>
	</Tabs.TabsList>

	<Tabs.TabsContent value="overview">
		{#if data.orgSubscription}
			<Card>
				<div class="flex flex-wrap items-start justify-between gap-4">
					<div>
						<div class="mb-1 flex items-center gap-2">
							<h3 class="font-semibold">
								{data.planName ?? data.orgSubscription.items.data[0]?.plan?.nickname ?? 'Plan'}
							</h3>
							<span
								class="rounded-full px-2 py-0.5 text-xs font-medium {statusClass[
									data.orgSubscription.status
								] ?? 'bg-muted text-muted-foreground'}"
							>
								{statusLabel[data.orgSubscription.status] ?? data.orgSubscription.status}
							</span>
						</div>
						<p class="text-muted-foreground text-sm">
							{#if data.orgSubscription.cancel_at}
								{m.flat_warm_fox_cancel({
									date: formatDate(new Date(data.orgSubscription.cancel_at * 1000))
								})}
							{:else}
								{m.flat_warm_fox_renew({
									date: formatDate(new Date(data.orgSubscription.current_period_end * 1000))
								})}
							{/if}
						</p>
					</div>
					{#if data.stripePortalUrl}
						<Button href={data.stripePortalUrl} target="_blank" variant="outline" size="sm">
							<ExternalLink class="mr-1.5 h-3.5 w-3.5" />
							{m.dull_tame_crow_hike()}
						</Button>
					{/if}
				</div>
			</Card>
		{:else}
			<Card>
				<p class="text-muted-foreground mb-4">{m.flat_warm_bear_none()}</p>
				<Button href={localizeHref('/pricing')} variant="outline" size="sm">View plans</Button>
			</Card>
		{/if}
	</Tabs.TabsContent>

	<Tabs.TabsContent value="invoices">
		<Card>
			{#if data.invoices.length === 0}
				<p class="text-muted-foreground">No invoices yet.</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-border border-b">
								<th class="text-muted-foreground pb-2 text-left font-medium">Date</th>
								<th class="text-muted-foreground pb-2 text-left font-medium">Description</th>
								<th class="text-muted-foreground pb-2 text-left font-medium"
									>{m.real_proud_dolphin_attend()}</th
								>
								<th class="text-muted-foreground pb-2 text-right font-medium">Total</th>
								<th class="pb-2"></th>
							</tr>
						</thead>
						<tbody>
							{#each data.invoices as invoice (invoice.id)}
								{@const status = invoice.status ?? 'draft'}
								<tr class="border-border border-b last:border-0">
									<td class="py-3 pr-4">{formatDate(new Date(invoice.created * 1000))}</td>
									<td class="py-3 pr-4 capitalize"
										>{invoice.billing_reason?.replace(/_/g, ' ') ?? 'Invoice'}</td
									>
									<td class="py-3 pr-4">
										<span
											class="rounded-full px-2 py-0.5 text-xs font-medium {invoiceStatusClass[
												status
											] ?? 'bg-muted text-muted-foreground'}"
										>
											{invoiceStatusLabel[status] ?? status}
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
	</Tabs.TabsContent>
</Tabs.Tabs>
