<script lang="ts">
	import { Code, Trash } from '@lucide/svelte';

	import { enhance } from '$app/forms';
	import UpgradeNotice from '$lib/components/blocks/upgrade-notice.svelte';
	import ApiTokenForm from '$lib/components/forms/api-token-form.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import CopyButton from '$lib/components/ui/copy-button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { getUserPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let planLimits = $derived(getUserPlanLimits(data.user?.subscriptionTier));

	let isConfirmationDialogOpen = $state(false);
	let selectedKeyForDeletion = $state<{ id: string; description: string | null } | null>(null);
</script>

{#if planLimits.apiAccess}
	<Card
		class="mb-6"
		title={m.actual_keen_rooster_find()}
		description={m.patchy_swift_fish_cuddle()}
	>
		<ApiTokenForm user={data.user} form={data.apiKeyForm} />
	</Card>

	<Card class="mb-6" title={m.lost_slimy_pelican_achieve()}>
		{#if data.apiKeys.length}
			{#each data.apiKeys as item, i (i)}
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
{:else}
	<UpgradeNotice tier={data.user?.subscriptionTier} class="mb-6" />
{/if}

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
				<Button type="submit" variant="destructive" class="max-sm:mb-2">
					{m.tense_spicy_jannes_hug()}
				</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Button variant="outline" href={localizeHref('/api-documentation')}>
	<Code class="me-2 h-4 w-4" />
	{m.deft_bright_insect_attend()}
</Button>
