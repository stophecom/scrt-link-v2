<script lang="ts">
	import { Trash } from '@lucide/svelte';

	import { enhance } from '$app/forms';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import CopyButton from '$lib/components/ui/copy-button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';

	type ApiKeyItem = { id: string; key: string; description: string | null };

	type Props = {
		apiKeys: ApiKeyItem[];
		// When set, revoking targets the organization's keys instead of the user's own.
		organizationId?: string;
		class?: string;
	};

	let { apiKeys, organizationId, class: className }: Props = $props();

	let isConfirmationDialogOpen = $state(false);
	let selectedKeyForDeletion = $state<ApiKeyItem | null>(null);
</script>

<Card class={className} title={m.lost_slimy_pelican_achieve()}>
	{#if apiKeys.length}
		{#each apiKeys as item (item.id)}
			<div
				class="bg-background/60 border-border mb-3 grid grid-cols-[100px_1fr] gap-2 overflow-hidden border p-2 px-4 sm:grid-cols-[100px_1fr_min-content_min-content]"
			>
				<div
					class="max-w-full items-center justify-center self-center justify-self-start truncate text-sm"
				>
					{item.description}
				</div>
				<Input type="text" value={item.key} disabled />
				<div class="col-span-2 flex justify-end">
					<CopyButton variant="ghost" text={item.key}></CopyButton>

					<Button
						variant="ghost"
						class="text-destructive"
						onclick={() => {
							selectedKeyForDeletion = item;
							isConfirmationDialogOpen = true;
						}}
					>
						<Trash class="me-2 h-4 w-4" />{m.tense_spicy_jannes_hug()}
					</Button>
				</div>
			</div>
		{/each}
	{:else}
		<p class="text-muted-foreground text-sm">
			{m.dry_tame_warthog_hurl()}
		</p>
	{/if}
</Card>

<Dialog.Root bind:open={isConfirmationDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.soft_aloof_barbel_splash()}</Dialog.Title>
			<Dialog.Description>
				<Markdown
					format
					markdown={m.firm_zippy_warthog_chop({
						description: selectedKeyForDeletion?.description || ''
					})}
				/>
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}>
				{m.big_due_warthog_rest()}
			</Dialog.Close>
			<form
				method="post"
				use:enhance
				action="?/revokeAPIToken"
				onsubmit={() => (isConfirmationDialogOpen = false)}
			>
				<input type="hidden" name="keyId" value={selectedKeyForDeletion?.id} />
				{#if organizationId}
					<input type="hidden" name="organizationId" value={organizationId} />
				{/if}
				<Button type="submit" variant="destructive" class="max-sm:mb-2">
					{m.tense_spicy_jannes_hug()}
				</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
