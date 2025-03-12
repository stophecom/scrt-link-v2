<script lang="ts">
	import Flame from 'lucide-svelte/icons/flame';
	import Reply from 'lucide-svelte/icons/reply';
	import { tick } from 'svelte';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { createDownloadLinkAndClick, sendMessageToServiceWorker } from '$lib/client/utils';
	import { decryptString } from '$lib/client/web-crypto';
	import Password from '$lib/components/forms/form-fields/password.svelte';
	import * as Form from '$lib/components/ui/form';
	import { SecretType } from '$lib/data/enums';
	import { type FileMeta, type FileReference, handleFileChunksDownload } from '$lib/file-transfer';
	import * as m from '$lib/paraglide/messages.js';
	import { type RevealSecretFormSchema, revealSecretFormSchema } from '$lib/validators/formSchemas';

	import FileRevelation from '../elements/file-revelation.svelte';
	import SnapRevelation from '../elements/snap-revelation.svelte';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import FormWrapper from './form-wrapper.svelte';
	import type { Meta } from './secret-form.svelte';

	type Props = {
		form: SuperValidated<Infer<RevealSecretFormSchema>>;
		secretIdHash: string;
		masterKey: string;
		showPasswordInput: boolean;
	};
	const { form, masterKey, secretIdHash, showPasswordInput }: Props = $props();

	let meta: string = $state('');
	let metaParsed: Meta | undefined = $state();
	let content = $state('');
	let imageUrl: string | undefined = $state();
	let contentParsed: FileReference | undefined = $state();

	let progress = $state(0);
	let error: string = $state('');

	let isSecretFileOrSnap = $derived(
		metaParsed?.secretType === SecretType.FILE || metaParsed?.secretType === SecretType.SNAP
	);
	let isSnap = $derived(metaParsed?.secretType === SecretType.SNAP);
	let isSecretRedirect = $derived(metaParsed?.secretType === SecretType.REDIRECT);
	let fileMeta = $derived(isSecretFileOrSnap ? metaParsed : undefined) as FileMeta;
	let fileReference = $derived(isSecretFileOrSnap ? contentParsed : undefined) as FileReference;

	const partialSchema = revealSecretFormSchema().omit({ password: true });

	const revealSecretForm = superForm(form, {
		validators: zodClient(showPasswordInput ? revealSecretFormSchema() : partialSchema),
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
					// We saved fileReference as content
					contentParsed = JSON.parse(content);

					if (!('serviceWorker' in navigator) && metaParsed && !metaParsed.isSingleChunk) {
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

	const handleProgress = async (getProgress: () => Promise<number>) => {
		const progressInterval = setInterval(async () => {
			progress = await getProgress();

			if (progress >= 1) {
				// Sometimes progress is above 1 for some reason
				progress = 1;

				clearInterval(progressInterval);
				return Promise.resolve('File saved!');
			}
		}, 500);
	};

	const downloadFileAsStream = async (
		secretIdHash: string,
		fileMeta: FileMeta,
		fileReference: FileReference,
		decryptionKey: string
	) => {
		const fileInfo = {
			secretIdHash,
			...fileMeta,
			...fileReference,
			decryptionKey,
			url: `/service-worker-file-download#${secretIdHash}`
		};

		// Ensure that you're not passing anything that could be non-clonable
		const sanitizedMessage = JSON.parse(JSON.stringify(fileInfo));

		await sendMessageToServiceWorker({
			request: 'file_info',
			data: sanitizedMessage
		});

		createDownloadLinkAndClick(fileInfo.url);
	};

	const fetchSecretFile = async (skipDownload: boolean) => {
		try {
			if (fileMeta && fileReference) {
				// If only one chunk, we download immediately.
				if (fileMeta.isSingleChunk && fileReference.chunks.length === 1) {
					const file = {
						secretIdHash,
						decryptionKey: masterKey,
						...fileReference,
						...fileMeta,
						progress: 0
					};
					const res = new Response(handleFileChunksDownload(file));

					await handleProgress(() => Promise.resolve(file.progress));
					const blob = await res.blob();
					const decryptedFile = new File([blob], fileMeta.name);
					const url = window.URL.createObjectURL(decryptedFile);

					if (skipDownload) {
						return Promise.resolve(url);
					}

					createDownloadLinkAndClick(url, fileMeta.name);
				}

				await downloadFileAsStream(secretIdHash, fileMeta, fileReference, masterKey);

				await handleProgress(() =>
					sendMessageToServiceWorker<number>({
						request: 'progress',
						data: { secretIdHash: secretIdHash }
					})
				);
			}
		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			}
		}
	};
</script>

{#if error}
	<Alert data-testid="download-error" class="mt-4 mb-4" variant="destructive">
		{error}
	</Alert>
{/if}

{#if !isSecretRedirect}
	<div class="bg-card border-border w-full rounded border p-6 shadow-lg sm:p-8">
		{#if content}
			{#if isSecretFileOrSnap}
				{#if isSnap}
					<!-- Secret Type: Snap -->
					<SnapRevelation {imageUrl} />
				{:else}
					<!-- Secret Type: File -->
					<FileRevelation {progress} {fileMeta} />
				{/if}
			{:else}
				<!-- Secret Type: Text -->
				{content}
				<div class="flex items-center justify-end pt-2">
					<Button href="/" class="mr-2" size="sm" variant="ghost">
						<Flame class="mr-2 h-4 w-4" /> {m.left_cool_raven_zap()}</Button
					>

					<CopyButton text={content} />
				</div>
			{/if}
		{:else}
			{#if showPasswordInput}
				<h2 class="mb-4 text-3xl font-bold">{m.low_tame_lark_amaze()}</h2>
				<p class="mb-4 text-xl leading-normal">
					{m.alive_new_blackbird_stop()}
				</p>
			{:else}
				<p class="mb-4 text-xl leading-normal">
					{m.short_known_mule_play()}
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
						<Form.Button delayed={$delayed} class="w-full" size="lg"
							>{m.same_gaudy_iguana_bend()}</Form.Button
						>
					</div>
				</form>
			</FormWrapper>
		{/if}
	</div>

	{#if content}
		<div class="pt-2">
			<Button href="/" variant="ghost"
				><Reply class="mr-2 h-4 w-4" />{m.giant_smug_lobster_clasp()}</Button
			>
		</div>
	{/if}
{/if}
