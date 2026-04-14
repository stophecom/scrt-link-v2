<script lang="ts">
	import { AlertTriangle, Lock, Trash2, Unlock } from '@lucide/svelte';
	import { decryptResponseContent, unwrapAESKeyWithRSA, unwrapPrivateKey } from '@scrt-link/core';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { enhance } from '$app/forms';
	import { getMasterKey, isKeyUnlocked } from '$lib/client/key-manager';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CopyButton from '$lib/components/ui/copy-button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { formatDateTime } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let decryptedResponse = $state('');
	let decryptionError = $state('');
	let isDecrypting = $state(false);
	let isConfirmationDialogOpen = $state(false);

	const decrypt = async () => {
		if (!isKeyUnlocked()) {
			decryptionError = 'Encryption keys are not unlocked. Please log in again.';
			return;
		}

		isDecrypting = true;
		try {
			const masterKey = getMasterKey();

			// Unwrap the RSA private key using the master key
			const privateKey = await unwrapPrivateKey(data.request.encryptedPrivateKey, masterKey);

			// Unwrap the AES key using the RSA private key
			const aesKey = await unwrapAESKeyWithRSA(data.request.wrappedResponseKey, privateKey);

			// Decrypt the response content
			decryptedResponse = await decryptResponseContent(
				data.request.encryptedResponseContent,
				aesKey
			);
		} catch (e) {
			console.error('Decryption failed:', e);
			decryptionError = 'Failed to decrypt the response. Your encryption keys may have changed.';
		} finally {
			isDecrypting = false;
		}
	};

	onMount(() => {
		if (isKeyUnlocked()) {
			decrypt();
		}
	});
</script>

<Button variant="ghost" size="sm" href={localizeHref('/account/requests')} class="mb-4">
	&larr; {m.swift_slim_deer_turn()}
</Button>

<Card title={m.safe_deep_wolf_read()}>
	{#if data.request.respondedAt}
		<p class="text-muted-foreground mb-4 text-sm">
			{m.glad_true_lark_note({ dateTime: formatDateTime(data.request.respondedAt) })}
		</p>
	{/if}

	{#if decryptionError}
		<div class="bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg p-4">
			<AlertTriangle class="mt-0.5 h-5 w-5 shrink-0" />
			<div>
				<p class="font-medium">{m.red_sharp_viper_fail()}</p>
				<p class="mt-1 text-sm opacity-80">{decryptionError}</p>
			</div>
		</div>
	{:else if !isKeyUnlocked()}
		<div class="flex flex-col items-center gap-4 py-8">
			<Lock class="text-muted-foreground h-10 w-10" />
			<p class="text-muted-foreground">{m.dim_quiet_raven_lock()}</p>
			<Button href={localizeHref('/account')}>{m.swift_plain_duck_go()}</Button>
		</div>
	{:else if isDecrypting}
		<div class="flex items-center gap-2 py-8">
			<Unlock class="text-primary h-5 w-5 animate-pulse" />
			<p class="text-muted-foreground">{m.slow_calm_newt_spin()}</p>
		</div>
	{:else if decryptedResponse}
		<div class="bg-muted rounded-lg p-4">
			<pre class="font-mono text-sm break-words whitespace-pre-wrap">{decryptedResponse}</pre>
		</div>
		<div class="mt-4 flex justify-end gap-2">
			<Button variant="outline" onclick={() => (isConfirmationDialogOpen = true)}>
				<Trash2 class="mr-2 h-4 w-4" />
				{m.flat_red_ant_burn()}
			</Button>
			<CopyButton text={decryptedResponse} />
		</div>
	{/if}
</Card>

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
					return async ({ update }) => {
						toast.success('Request deleted.');
						await update();
					};
				}}
			>
				<Button type="submit" class="max-sm:mb-2">{m.simple_active_cowfish_spur()}</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
