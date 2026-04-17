<script lang="ts">
	import { Clock, Eye, Hourglass, Mail, MailOpen, Trash2 } from '@lucide/svelte';
	import { decryptResponseContent } from '@scrt-link/core';
	import { toast } from 'svelte-sonner';

	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { getMasterKey, isKeyUnlocked } from '$lib/client/key-manager';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { formatDateTime } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	type Request = {
		id: string;
		receiptId: string | null;
		hasNote: boolean;
		encryptedNoteForOwner: string | null;
		expiresAt: Date;
		respondedAt: Date | null;
		viewedAt: Date | null;
		createdAt: Date;
		status: 'pending' | 'responded' | 'viewed' | 'expired';
	};

	type Props = {
		requests: Request[];
		unreadCount: number;
	};

	let { requests, unreadCount }: Props = $props();

	const currentDate = new Date();

	let activeFilter = $state<'all' | 'unread' | 'pending'>('all');
	let showExpired = $state(false);
	let isConfirmationDialogOpen = $state(false);
	let selectedRequestForDeletion = $state<Request | null>(null);
	let decryptedNotes = $state<Record<string, string>>({});

	let filteredRequests = $derived.by(() => {
		let result = showExpired ? requests : requests.filter((r) => r.status !== 'expired');
		if (activeFilter === 'unread') return result.filter((r) => r.status === 'responded');
		if (activeFilter === 'pending') return result.filter((r) => r.status === 'pending');
		return result;
	});

	const decryptNotes = async (secretRequests: Request[]) => {
		if (!isKeyUnlocked()) return;
		const masterKey = getMasterKey();
		const entries = await Promise.all(
			secretRequests
				.filter((r) => r.encryptedNoteForOwner)
				.map(async (r) => {
					try {
						const note = await decryptResponseContent(r.encryptedNoteForOwner!, masterKey);
						return [r.id, note] as const;
					} catch {
						return null;
					}
				})
		);
		decryptedNotes = Object.fromEntries(entries.filter((e): e is [string, string] => e !== null));
	};

	$effect(() => {
		decryptNotes(requests);
	});

	const statusConfig = {
		pending: { label: m.still_calm_snail_wait(), icon: Hourglass, class: 'text-info' },
		responded: {
			label: m.keen_bold_lark_unread(),
			icon: Mail,
			class: 'text-success'
		},
		viewed: { label: m.soft_done_moth_rest(), icon: MailOpen, class: 'text-muted-foreground' },
		expired: { label: m.dull_cold_fish_stop(), icon: Clock, class: 'text-destructive' }
	} as const;
</script>

<Card>
	<CardTitle>{m.neat_warm_crane_view()}</CardTitle>
	{#if requests.length === 0}
		<p class="text-muted-foreground py-8 text-center">{m.mild_shy_parrot_rest()}</p>
	{:else}
		<Tabs.Root bind:value={activeFilter} class="mb-4">
			<Tabs.List>
				<Tabs.Trigger value="all">{m.warm_clear_fox_all()}</Tabs.Trigger>
				<Tabs.Trigger value="unread">
					{m.keen_bold_lark_unread()}
					{#if unreadCount > 0}
						<span
							class="bg-primary text-primary-foreground ml-1.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-semibold"
							>{unreadCount}</span
						>
					{/if}
				</Tabs.Trigger>
				<Tabs.Trigger value="pending">{m.still_calm_snail_wait()}</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>

		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>{m.true_knotty_canary_work()}</Table.Head>
					<Table.Head>{m.bright_calm_deer_note()}</Table.Head>
					<Table.Head>{m.fair_keen_bee_check()}</Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each filteredRequests as request (request.id)}
					{@const config = statusConfig[request.status]}
					<Table.Row>
						<Table.Cell class="font-medium">
							<span class="inline-block p-1 font-mono" data-testid="request-receipt-id"
								>{request.receiptId ?? '—'}</span
							>
						</Table.Cell>
						<Table.Cell>
							{#if decryptedNotes[request.id]}
								<Tooltip.Root>
									<Tooltip.Trigger>
										<span class="inline-block max-w-32 truncate align-bottom sm:max-w-48">
											{decryptedNotes[request.id]}
										</span>
									</Tooltip.Trigger>
									<Tooltip.Content>
										{decryptedNotes[request.id]}
									</Tooltip.Content>
								</Tooltip.Root>
							{:else}
								<span class="text-muted-foreground">—</span>
							{/if}
						</Table.Cell>
						<Table.Cell>
							<Tooltip.Root>
								<Tooltip.Trigger>
									<div
										class="inline-flex items-center gap-1.5 whitespace-nowrap {config.class}"
										data-testid="request-status"
									>
										<config.icon class="h-4 w-4 shrink-0" />
										<span data-testid="request-status-label">{config.label}</span>
									</div>
								</Tooltip.Trigger>
								<Tooltip.Content class="text-left">
									<p>{m.shy_brave_owl_born()}: {formatDateTime(request.createdAt)}</p>
									{#if request.respondedAt}
										<p>{m.calm_rich_puma_back()}: {formatDateTime(request.respondedAt)}</p>
									{/if}
									{#if request.expiresAt > currentDate}
										<p>{m.warm_old_crab_fade()}: {formatDateTime(request.expiresAt)}</p>
									{:else}
										<p>{m.trick_caring_lionfish_grasp()}</p>
									{/if}
								</Tooltip.Content>
							</Tooltip.Root>
						</Table.Cell>
						<Table.Cell>
							<div class="flex items-center justify-end gap-2">
								{#if request.status !== 'expired' && request.status !== 'pending'}
									<Button
										size="sm"
										variant="outline"
										href={localizeHref(`/account/requests/${request.id}`)}
										data-testid="view-response"
									>
										<Eye class="mr-1.5 h-3.5 w-3.5" />
										{m.keen_bright_fox_peek()}
									</Button>
								{/if}
								<button
									class="text-destructive inline-flex p-1 hover:underline"
									onclick={() => {
										selectedRequestForDeletion = request;
										isConfirmationDialogOpen = true;
									}}
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>

		<Dialog.Root bind:open={isConfirmationDialogOpen}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>{m.soft_aloof_barbel_splash()}</Dialog.Title>
					<Dialog.Description>
						{m.warm_quick_cow_warn()}
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'outline' })}
						>{m.big_due_warthog_rest()}</Dialog.Close
					>
					<form
						method="POST"
						action="?/deleteRequest"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									isConfirmationDialogOpen = false;
									await invalidate('app:requests');
									toast.success(m.bold_kind_ram_gone());
								}
							};
						}}
					>
						<input type="hidden" name="requestId" value={selectedRequestForDeletion?.id ?? ''} />
						<Button type="submit" class="max-sm:mb-2">{m.simple_active_cowfish_spur()}</Button>
					</form>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>

		<Separator class="my-6" />
		<div class="inline-flex items-center">
			<Switch id="expired-requests-switch" bind:checked={showExpired} /><label
				for="expired-requests-switch"
				class="ms-2 cursor-pointer">{m.trim_proud_coyote_glow()}</label
			>
		</div>
	{/if}
</Card>
