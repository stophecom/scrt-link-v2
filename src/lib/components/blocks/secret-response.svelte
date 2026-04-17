<script lang="ts">
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import Check from '@lucide/svelte/icons/circle-check-big';
	import { decryptRequestNote } from '@scrt-link/core';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { page } from '$app/state';
	import SecretResponseForm from '$lib/components/forms/secret-response-form.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { m } from '$lib/paraglide/messages.js';

	type Props = {
		data: {
			encryptedNote: string | null;
			alreadyResponded: boolean;
			requesterName: string | null;
			requesterEmail: string;
			requesterEmailVerified: boolean | null;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			form: any;
			publicKey: string;
			requestIdHash: string;
		};
		successMessage: string;
	};

	let { data, successMessage = $bindable('') }: Props = $props();

	let decryptedNote = $state('');

	onMount(async () => {
		if (data.encryptedNote) {
			const hash = page.url.hash.slice(1);
			if (hash) {
				const pipeIndex = hash.indexOf('|');
				if (pipeIndex !== -1) {
					const noteKey = hash.substring(pipeIndex + 1);
					try {
						decryptedNote = await decryptRequestNote(data.encryptedNote, noteKey);
					} catch {
						// Note decryption failed — show form without note
					}
				}
			}
		}
	});
</script>

{#if data.alreadyResponded && !successMessage}
	<Card>
		<div class="py-8 text-center">
			<p class="text-muted-foreground">{m.calm_safe_seal_rest()}</p>
		</div>
	</Card>
{:else if successMessage}
	<div
		in:fade
		class="border-primary bg-card relative mb-2 flex min-h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded border px-4 py-6 shadow-lg md:p-8"
		data-testid="response-success"
	>
		<Check class="text-primary mb-4 h-12 w-12" />
		<h3 class="text-primary mb-2 text-2xl font-semibold">
			{m.proud_glad_bear_cheer()}
		</h3>
		<p class="text-muted-foreground text-center">{m.ornate_fluffy_ox_explore()}</p>
	</div>
{:else}
	<Card class="mb-6">
		<div class="bg-muted mb-6 rounded-lg p-4">
			<p class="text-muted-foreground mb-1 flex items-center gap-1.5 text-sm font-medium">
				{m.warm_clear_jay_speak({ name: data.requesterName || '', email: data.requesterEmail })}
				{#if data.requesterEmailVerified}
					<Tooltip.Root>
						<Tooltip.Trigger>
							<CircleCheck class="text-success h-4 w-4" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							{m.green_round_duck_trust()}
						</Tooltip.Content>
					</Tooltip.Root>
				{/if}
			</p>
			{#if decryptedNote}
				<p data-testid="decrypted-note">{decryptedNote}</p>
			{/if}
		</div>

		<SecretResponseForm
			form={data.form}
			publicKeyJWK={data.publicKey}
			requestIdHash={data.requestIdHash}
			bind:successMessage
		/>
	</Card>
	<Alert class="mb-4" variant="info">
		{m.safe_green_elk_guard()}
	</Alert>
{/if}
