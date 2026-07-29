<script lang="ts">
	import Flame from '@lucide/svelte/icons/flame';
	import Reply from '@lucide/svelte/icons/reply';
	import { decryptString, SecretType } from '@scrt-link/core';
	import { tick } from 'svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { FileDownloader } from '$lib/client/file-download.svelte';
	import Password from '$lib/components/forms/form-fields/password.svelte';
	import * as Form from '$lib/components/ui/form';
	import {
		type FileReference,
		type FilesEnvelope,
		normalizeFileEnvelope
	} from '$lib/file-transfer';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { type RevealSecretFormSchema, revealSecretFormSchema } from '$lib/validators/formSchemas';

	import FileRevelationList from '../blocks/file-revelation-list.svelte';
	import NeogramRevelation from '../blocks/neogram-revelation.svelte';
	import SnapRevelation from '../blocks/snap-revelation.svelte';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import FormWrapper from './form-wrapper.svelte';
	import type { Meta } from './secret-form.svelte';

	type Props = {
		form: SuperValidated<RevealSecretFormSchema>;
		secretIdHash: string;
		masterKey: string;
		showPasswordInput: boolean;
		remainingViews: number;
	};
	const { form, masterKey, secretIdHash, showPasswordInput, remainingViews }: Props = $props();

	let meta: string = $state('');
	let metaParsed: Meta | undefined = $state();
	let content = $state('');
	let imageUrl: string | undefined = $state();
	let downloader: FileDownloader | undefined = $state();

	let error: string = $state('');

	let isSecretFileOrSnap = $derived(
		metaParsed?.secretType === SecretType.FILE || metaParsed?.secretType === SecretType.SNAP
	);
	let isSnap = $derived(metaParsed?.secretType === SecretType.SNAP);
	// Defaults to singular until the downloader has parsed the file envelope.
	let isSingleFile = $derived((downloader?.files.length ?? 1) === 1);
	let isNeogram = $derived(metaParsed?.secretType === SecretType.NEOGRAM);
	let isSecretRedirect = $derived(metaParsed?.secretType === SecretType.REDIRECT);

	const partialSchema = revealSecretFormSchema().omit({ password: true });

	const revealSecretForm = superForm(form, {
		validators: zod4Client(showPasswordInput ? revealSecretFormSchema() : partialSchema),
		validationMethod: 'auto',
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				if (result?.data?.meta) {
					meta = await decryptString(result.data.meta, masterKey);

					if ($formData.password) {
						meta = await decryptString(meta, $formData.password);
					}

					metaParsed = JSON.parse(meta);
				}

				if (result?.data?.content) {
					content = await decryptString(result.data.content, masterKey);

					if ($formData.password) {
						content = await decryptString(content, $formData.password);
					}
					await tick();
				}

				if (isSecretRedirect) {
					// Do redirect
					window.location.replace(content);
				}

				if (isSecretFileOrSnap) {
					// We saved the file envelope as content
					const envelope = normalizeFileEnvelope(
						JSON.parse(content) as FilesEnvelope | FileReference,
						metaParsed
					);

					downloader = new FileDownloader({
						envelope,
						secretIdHash,
						decryptionKey: masterKey
					});

					if (!('serviceWorker' in navigator) && downloader.requiresServiceWorker) {
						throw Error(
							'Your browser is not supported: Service worker not available. Try a different device or browser.'
						);
					}

					imageUrl = await fetchSecretFile(isSnap);
				}

				history.replaceState(null, 'Secret destroyed', '#🔥');
			}
		},
		onError(event) {
			// Fallback
			$message = {
				status: 'error',
				title: `${event.result.status}`,
				description: event.result.error.message
			};
		}
	});

	const { form: formData, message, delayed, constraints, enhance } = revealSecretForm;

	const fetchSecretFile = async (skipDownload: boolean) => {
		try {
			const files = downloader?.files ?? [];

			if (!downloader || !files.length) {
				return;
			}

			// Snap shows the image inline instead of downloading it.
			if (skipDownload) {
				return await downloader.toObjectUrl(files[0]);
			}

			// A single file downloads on reveal, as it always has. With several files
			// we'd trigger a burst of downloads the recipient never asked for, so they
			// pick from the list instead.
			if (files.length === 1) {
				await downloader.download(files[0]);
			}
		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			}
		}
	};
</script>

{#if error}
	<Alert class="mt-4 mb-4" variant="destructive">
		{error}
	</Alert>
{/if}

{#if !isSecretRedirect}
	<div class="bg-card border-border w-full rounded border p-6 shadow-lg sm:p-8">
		{#if content}
			{#if isSecretFileOrSnap}
				{#if isSnap}
					<!-- Secret Type: Snap -->
					<SnapRevelation {imageUrl} destructionTimer={metaParsed?.destructionTimer} />
				{:else}
					<!-- Secret Type: File -->
					<h3 class="mb-2 pt-4 text-2xl font-semibold">
						{isSingleFile
							? m.house_warm_fox_transform()
							: m.flat_warm_file_reveal_heading_multiple()}
					</h3>
					<p class="mb-3">
						{isSingleFile ? m.helpful_mean_salmon_slurp() : m.flat_warm_file_reveal_note_multiple()}
					</p>
					{#if downloader}
						<FileRevelationList {downloader} />
					{/if}
				{/if}
			{:else if isNeogram}
				<NeogramRevelation neogram={content} destructionTimer={metaParsed?.destructionTimer} />
			{:else}
				<!-- Secret Type: Text -->
				<div class="break-words whitespace-pre-wrap" data-testid="secret-revelation-content">
					{content}
				</div>
				<div class="flex items-center justify-end pt-2">
					<Button href={localizeHref('/')} class="mr-2" size="sm" variant="ghost">
						<Flame class="mr-2 h-4 w-4" /> {m.left_cool_raven_zap()}</Button
					>

					<CopyButton text={content} />
				</div>
			{/if}
		{:else}
			{#if showPasswordInput}
				<h2 class="mb-4 text-3xl font-bold">{m.low_tame_lark_amaze()}</h2>
				<p class="mb-4 text-xl leading-normal">
					{remainingViews > 1
						? m.spare_tangy_lark_view({ number: remainingViews })
						: m.alive_new_blackbird_stop()}
				</p>
			{:else}
				<p class="mb-4 text-xl leading-normal">
					{remainingViews > 1
						? m.spare_tangy_crow_view({ number: remainingViews })
						: m.short_known_mule_play()}
				</p>
			{/if}
			<FormWrapper message={$message}>
				<form method="POST" use:enhance>
					{#if showPasswordInput}
						<Form.Field form={revealSecretForm} name="password" class="py-4">
							<Password
								bind:value={$formData.password}
								{...$constraints.password}
								placeholder="Password*"
							/>
						</Form.Field>
					{/if}
					<input type="hidden" name="secretIdHash" value={secretIdHash} />

					<div class="py-4">
						<Form.Button
							data-testid="revelation-form-submit"
							delayed={$delayed}
							class="w-full"
							size="lg">{m.same_gaudy_iguana_bend()}</Form.Button
						>
					</div>
				</form>
			</FormWrapper>
		{/if}
	</div>

	{#if content}
		<div class="pt-2">
			<Button href={localizeHref('/')} variant="ghost"
				><Reply class="mr-2 h-4 w-4" />{m.giant_smug_lobster_clasp()}</Button
			>
		</div>
	{/if}
{/if}
