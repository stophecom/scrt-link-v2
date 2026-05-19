<script lang="ts">
	import { ArrowLeft, Trash2, TriangleAlert, Unlock } from '@lucide/svelte';
	import { decryptResponseContent, unwrapAESKeyWithRSA, unwrapPrivateKey } from '@scrt-link/core';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { enhance } from '$app/forms';
	import { SECRET_REQUEST_RETENTION_PERIOD_IN_DAYS } from '$lib/client/constants';
	import { getMasterKey, isKeyUnlocked } from '$lib/client/key-manager';
	import { createDownloadLinkAndClick, sendMessageToServiceWorker } from '$lib/client/utils';
	import FileRevelation from '$lib/components/blocks/file-revelation.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CopyButton from '$lib/components/ui/copy-button';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { FileMeta, FileReference } from '$lib/file-transfer';
	import { handleFileChunksDownload } from '$lib/file-transfer';
	import { formatDateTime } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	type Props = {
		data: {
			request: {
				id: string;
				requestIdHash: string;
				encryptedPrivateKey: string;
				encryptedResponseContent: string | null;
				wrappedResponseKey: string;
				encryptedResponseMeta: string | null;
				encryptedResponseFile: string | null;
				respondedAt: Date | null;
				createdAt: Date;
			};
		};
	};

	let { data }: Props = $props();

	let decryptedResponse = $state('');
	let decryptionError = $state('');
	let isDecrypting = $state(false);
	let isConfirmationDialogOpen = $state(false);
	let fileKey = $state('');
	let fileMeta = $state<FileMeta | undefined>(undefined);
	let fileReference = $state<FileReference | undefined>(undefined);
	let downloadProgress = $state(0);
	let downloadError = $state('');

	let destructionDate = $derived(
		data.request.respondedAt
			? new Date(
					data.request.respondedAt.getTime() + SECRET_REQUEST_RETENTION_PERIOD_IN_DAYS * 86400000
				)
			: null
	);

	const decrypt = async () => {
		if (!isKeyUnlocked()) {
			decryptionError = 'Encryption keys are not unlocked. Please log in again.';
			return;
		}

		isDecrypting = true;
		try {
			const masterKey = getMasterKey();
			const privateKey = await unwrapPrivateKey(data.request.encryptedPrivateKey, masterKey);
			const aesKey = await unwrapAESKeyWithRSA(data.request.wrappedResponseKey, privateKey);

			if (data.request.encryptedResponseContent) {
				decryptedResponse = await decryptResponseContent(
					data.request.encryptedResponseContent,
					aesKey
				);
			}

			if (data.request.encryptedResponseFile) {
				const envelope = JSON.parse(
					await decryptResponseContent(data.request.encryptedResponseFile, aesKey)
				);
				fileKey = envelope.fileKey;
				fileReference = envelope.fileReference;
				fileMeta = envelope.fileMeta;
			}
		} catch (e) {
			console.error('Decryption failed:', e);
			decryptionError = 'Failed to decrypt the response. Your encryption keys may have changed.';
		} finally {
			isDecrypting = false;
		}
	};

	const handleProgress = (getProgress: () => Promise<number>): (() => void) => {
		const id = setInterval(async () => {
			downloadProgress = await getProgress();
			if (downloadProgress >= 1) {
				downloadProgress = 1;
				clearInterval(id);
			}
		}, 500);
		return () => clearInterval(id);
	};

	const downloadAttachment = async () => {
		if (!fileMeta || !fileReference) return;
		downloadError = '';
		let cancelProgress: (() => void) | undefined;
		try {
			// Single chunk — download and decrypt directly.
			if (fileMeta.isSingleChunk && fileReference.chunks.length === 1) {
				const file = {
					secretIdHash: data.request.requestIdHash,
					requestIdHash: data.request.requestIdHash,
					decryptionKey: fileKey,
					...fileReference,
					...fileMeta,
					progress: 0
				};
				const res = new Response(handleFileChunksDownload(file));
				cancelProgress = handleProgress(() => Promise.resolve(file.progress));
				const blob = await res.blob();
				const decryptedFile = new File([blob], fileMeta.name);
				const url = window.URL.createObjectURL(decryptedFile);
				createDownloadLinkAndClick(url, fileMeta.name);
				return;
			}

			// Multi chunk — stream via the service worker.
			const fileInfo = {
				secretIdHash: data.request.requestIdHash,
				requestIdHash: data.request.requestIdHash,
				...fileMeta,
				...fileReference,
				decryptionKey: fileKey,
				url: `/service-worker-file-download#${data.request.requestIdHash}`
			};
			const sanitizedMessage = JSON.parse(JSON.stringify(fileInfo));
			await sendMessageToServiceWorker({ request: 'file_info', data: sanitizedMessage });
			createDownloadLinkAndClick(fileInfo.url);
			cancelProgress = handleProgress(() =>
				sendMessageToServiceWorker<number>({
					request: 'progress',
					data: { secretIdHash: data.request.requestIdHash }
				})
			);
		} catch (e) {
			cancelProgress?.();
			downloadError = e instanceof Error ? e.message : String(e);
		}
	};

	onMount(() => {
		if (isKeyUnlocked()) {
			decrypt();
		}
	});
</script>

<Button variant="ghost" size="sm" href={localizeHref('/account/requests')} class="mb-4">
	<ArrowLeft class="me-2 h-4 w-4" />
	{m.swift_slim_deer_turn()}
</Button>

<Card title={m.safe_deep_wolf_read()}>
	{#if data.request.respondedAt && destructionDate}
		<p class="text-muted-foreground mb-4 text-sm">
			{m.glad_true_lark_note({
				receivedAt: formatDateTime(data.request.respondedAt),
				destructionDate: formatDateTime(destructionDate)
			})}
		</p>
	{/if}

	{#if decryptionError}
		<div class="bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg p-4">
			<TriangleAlert class="mt-0.5 h-5 w-5 shrink-0" />
			<div>
				<p class="font-medium">{m.red_sharp_viper_fail()}</p>
				<p class="mt-1 text-sm opacity-80">{decryptionError}</p>
			</div>
		</div>
	{:else if isDecrypting}
		<div class="flex items-center gap-2 py-8">
			<Unlock class="text-primary h-5 w-5 animate-pulse" />
			<p class="text-muted-foreground">{m.slow_calm_newt_spin()}</p>
		</div>
	{:else}
		{#if decryptedResponse}
			<div
				class="bg-muted grid grid-cols-[1fr_min-content] gap-4 rounded-lg p-4"
				data-testid="decrypted-response"
			>
				<pre
					class="wrap-break-words font-mono text-sm whitespace-pre-wrap">{decryptedResponse}</pre>
				<CopyButton variant="outline" size="sm" text={decryptedResponse} />
			</div>
		{/if}

		{#if fileMeta}
			<div class="mt-6" data-testid="decrypted-attachment">
				<h3 class="mb-1 text-lg font-semibold">{m.flat_warm_resp_attachment_heading()}</h3>
				<FileRevelation
					progress={downloadProgress}
					{fileMeta}
					handleDownload={downloadAttachment}
				/>

				{#if downloadError}
					<p class="text-destructive mt-2 text-sm">{downloadError}</p>
				{/if}
			</div>
		{/if}

		{#if decryptedResponse || fileMeta}
			<div class="mt-4 flex justify-start gap-2">
				<Button
					variant="outline"
					class="border-destructive text-destructive"
					onclick={() => (isConfirmationDialogOpen = true)}
				>
					<Trash2 class="mr-2 h-4 w-4" />
					{m.least_moving_spider_roam()}
				</Button>
			</div>
		{/if}
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
						toast.success(m.bold_kind_ram_gone());
						await update();
					};
				}}
			>
				<Button type="submit" class="max-sm:mb-2">{m.simple_active_cowfish_spur()}</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
