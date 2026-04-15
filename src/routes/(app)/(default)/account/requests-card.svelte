<script lang="ts">
	import { Clock, Eye, Hourglass, Mail, MailOpen, Trash2 } from '@lucide/svelte';
	import { decryptResponseContent } from '@scrt-link/core';
	import { onMount } from 'svelte';
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
	import { formatDateTime } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	type Request = {
		id: string;
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

	let showExpired = $state(false);
	let isConfirmationDialogOpen = $state(false);
	let selectedRequestForDeletion = $state<Request | null>(null);
	let decryptedNotes = $state<Record<string, string>>({});

	let filteredRequests = $derived(
		showExpired ? requests : requests.filter((r) => r.status !== 'expired')
	);

	onMount(async () => {
		if (!isKeyUnlocked()) return;
		const masterKey = getMasterKey();
		const entries = await Promise.all(
			requests
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
	});

	const statusConfig = {
		pending: { label: m.still_calm_snail_wait(), icon: Hourglass, class: 'text-info' },
		responded: {
			label: m.glad_new_robin_sing(),
			icon: Mail,
			class: 'text-success'
		},
		viewed: { label: m.soft_done_moth_rest(), icon: MailOpen, class: 'text-muted-foreground' },
		expired: { label: m.dull_cold_fish_stop(), icon: Clock, class: 'text-destructive' }
	} as const;
</script>

<Card>
	<CardTitle>
		{m.neat_warm_crane_view()}
		{#if unreadCount > 0}
			<span
				class="bg-primary text-primary-foreground ml-2 inline-flex items-center rounded-full px-2 py-0.5 align-middle text-xs font-semibold"
				>{unreadCount}</span
			>
		{/if}
	</CardTitle>
	{#if requests.length === 0}
		<p class="text-muted-foreground py-8 text-center">{m.mild_shy_parrot_rest()}</p>
	{:else}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>{m.slim_true_ant_mark()}</Table.Head>
					<Table.Head>{m.fair_keen_bee_check()}</Table.Head>
					<Table.Head>{m.warm_old_crab_fade()}</Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each filteredRequests as request (request.id)}
					{@const config = statusConfig[request.status]}
					<Table.Row>
						<Table.Cell>
							<div>{formatDateTime(request.createdAt)}</div>
							{#if decryptedNotes[request.id]}
								<p class="text-muted-foreground mt-0.5 max-w-48 truncate text-xs">
									{decryptedNotes[request.id]}
								</p>
							{/if}
						</Table.Cell>
						<Table.Cell>
							<div class="inline-flex items-center gap-1.5 {config.class}">
								<config.icon class="h-4 w-4 shrink-0" />
								<span>{config.label}</span>
							</div>
						</Table.Cell>
						<Table.Cell>
							{#if request.expiresAt > currentDate}
								{formatDateTime(request.expiresAt)}
							{:else}
								<span class="text-muted-foreground">{m.trick_caring_lionfish_grasp()}</span>
							{/if}
						</Table.Cell>
						<Table.Cell>
							<div class="flex items-center justify-end gap-2">
								{#if request.status !== 'expired' && request.status !== 'pending'}
									<Button
										size="sm"
										variant="outline"
										href={localizeHref(`/account/requests/${request.id}`)}
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
