<script lang="ts">
	import { CheckCircle2, Flame } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api';
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Markdown from '$lib/components/ui/markdown';
	import { Separator } from '$lib/components/ui/separator';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { formatDateTime } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import type { Secret } from '$lib/server/db/schema';

	import type { PageServerData } from './$types';

	const currentDate = new Date();

	let { secrets, user, secretForm }: Pick<PageServerData, 'secrets' | 'user' | 'secretForm'> =
		$props();

	let showExpired = $state(false);
	let isConfirmationDialogOpen = $state(false);

	let filteredSecrets = $derived(
		showExpired
			? secrets
			: secrets.filter((item) => item.expiresAt > currentDate || item.retrievedAt !== null)
	);

	const deleteSecretByReceiptId = async (receiptId: string | null) => {
		if (!receiptId) {
			throw new Error('No receipt id.');
		}
		const { message } = await api<{ message: string }>(`/secrets/${receiptId}`, {
			method: 'DELETE'
		});

		isConfirmationDialogOpen = false;
		await invalidateAll();
		toast.success(message);
	};
</script>

{#snippet renderStatus(
	secret: { destroyed: boolean } & Pick<Secret, 'receiptId' | 'expiresAt' | 'retrievedAt'>
)}
	{#if secret.retrievedAt}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<div class="inline-flex items-center">
					{#if secret.destroyed}
						{m.clean_tidy_hornet_nudge()}
					{:else}
						{m.late_mean_platypus_ask()}<CheckCircle2 class="text-success ms-2 h-4 w-4" />
					{/if}
				</div>
			</Tooltip.Trigger>
			<Tooltip.Content>
				{#if secret.destroyed}
					{m.away_free_mouse_urge({ dateTime: formatDateTime(secret.retrievedAt) })}
				{:else}
					{m.patient_wise_fox_vent({ dateTime: formatDateTime(secret.retrievedAt) })}
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	{:else if secret.expiresAt > currentDate}
		{m.level_factual_ant_rise({ dateTime: formatDateTime(secret.expiresAt) })}
	{:else}
		{m.trick_caring_lionfish_grasp()}
	{/if}
{/snippet}

<Card class="mb-6" title={'My Secret Links'}>
	<div class="flex justify-start py-4">
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
				>{m.round_slow_hyena_pause()}</Dialog.Trigger
			>
			<Dialog.Content class="">
				<Dialog.Header>
					<Dialog.Title>{m.arable_proof_ladybug_drip()}</Dialog.Title>
				</Dialog.Header>
				<CreateSecret form={secretForm} {user} hidePrimaryFeatureList />
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<Table.Root>
		<Table.Caption
			><strong>{m.polite_weird_chicken_buy()}</strong>
			{m.zesty_caring_jurgen_support()}</Table.Caption
		>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[140px]">{m.true_knotty_canary_work()}</Table.Head>
				<Table.Head>{m.elegant_slimy_zebra_fulfill()}</Table.Head>
				<Table.Head>{m.fit_acidic_samuel_sway()}</Table.Head>
				<Table.Head class="text-right">{m.top_fancy_mink_loop()}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each filteredSecrets as secret}
				<Table.Row>
					<Table.Cell class="font-medium"
						><span class="inline-block p-1 font-mono">{secret.receiptId}</span></Table.Cell
					>
					<Table.Cell
						>{#if secret.publicNote}{secret.publicNote}{:else}
							<em>{m.true_careful_turtle_fold()}</em>
						{/if}
					</Table.Cell>
					<Table.Cell>{@render renderStatus(secret)}</Table.Cell>
					<Table.Cell class="text-right">
						{#if !secret.retrievedAt && secret.expiresAt > currentDate}
							<Dialog.Root bind:open={isConfirmationDialogOpen}>
								<Dialog.Trigger class="text-destructive inline-flex p-1 hover:underline">
									<span>{m.arable_mellow_wolf_bubble()}</span>
									<Flame class="ms-1 h-4 w-4" />
								</Dialog.Trigger>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title>{m.soft_aloof_barbel_splash()}</Dialog.Title>
										<Dialog.Description>
											<Markdown
												format
												markdown={m.that_deft_alpaca_type({ receiptId: secret.receiptId || '' })}
											/>
										</Dialog.Description>
									</Dialog.Header>
									<Dialog.Footer>
										<Dialog.Close class={buttonVariants({ variant: 'outline' })}
											>{m.big_due_warthog_rest()}</Dialog.Close
										>
										<Button
											onclick={() => deleteSecretByReceiptId(secret.receiptId)}
											class="max-sm:mb-2">{m.simple_active_cowfish_spur()}</Button
										>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<Separator class=" my-6" />
	<div class="inline-flex items-center">
		<Switch id="expired-switch" bind:checked={showExpired} /><label
			for="expired-switch"
			class="ms-2 cursor-pointer">{m.mild_brave_dolphin_dart()}</label
		>
	</div>
</Card>
