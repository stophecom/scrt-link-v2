<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import FileLock from 'lucide-svelte/icons/file-lock';
	import Reply from 'lucide-svelte/icons/reply';
	import prettyBytes from 'pretty-bytes';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import { type FileMeta, type FileReference, handleFileChunksDownload } from '$lib/file-transfer';
	import * as m from '$lib/paraglide/messages.js';
	import { createDownloadLinkAndClick, sendMessageToServiceWorker } from '$lib/utils';
	import { type RevealSecretFormSchema, revealSecretFormSchema } from '$lib/validators/formSchemas';
	import { decryptString } from '$lib/web-crypto';

	import Password from '../form-fields/password.svelte';
	import Typewriter from '../helpers/typewriter.svelte';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import ProgressBar from '../ui/drop-zone/progress-bar/progress-bar.svelte';
	import UploadSpinner from '../ui/spinner/upload-spinner.svelte';
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
	let contentParsed: FileReference | undefined = $state();

	let progress = $state(0);
	// let isDownloading = $state(false);
	let error: string = $state('');

	let isSecretFile = $derived(metaParsed?.secretType === 'file');
	let fileMeta = $derived(isSecretFile ? metaParsed : undefined) as FileMeta;
	let fileReference = $derived(isSecretFile ? contentParsed : undefined) as FileReference;
	let isDownloading = $derived(progress < 1);

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
				}

				if (isSecretFile) {
					// We saved fileReference as content
					contentParsed = JSON.parse(content);

					if (!('serviceWorker' in navigator) && metaParsed && !metaParsed.isSingleChunk) {
						throw Error(
							'Your browser is not supported: Service worker not available. Try a different device or browser.'
						);
					}
					fetchSecretFile();
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

	const fetchSecretFile = async () => {
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
					createDownloadLinkAndClick(url, fileMeta.name);

					return Promise.resolve('File saved!');
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
	<Alert data-testid="download-error" class="mb-4 mt-4" variant="destructive">
		{error}
	</Alert>
{/if}

<div class="w-full rounded border bg-card px-8 pb-8 pt-12 shadow-lg">
	{#if content}
		{#if isSecretFile}
			<h3 class="mb-2 text-2xl font-semibold">{m.house_warm_fox_transform()}</h3>
			<p class="mb-3">
				{m.helpful_mean_salmon_slurp()}
			</p>
			<div class="relative min-h-24 rounded border border-foreground bg-background p-4">
				<div
					class="absolute left-0 top-0 h-full rounded bg-muted"
					style="min-width: 0%; width: {progress * 100}%"
				></div>

				<div class="grid grid-cols-[min-content_1fr] gap-4">
					<div class="flex items-center">
						<FileLock class="h-10 w-10 text-primary" />
					</div>

					<div class="relative">
						<div class="flex truncate">
							<strong class="mr-1">{m.suave_level_squirrel_hope()}</strong>
							<Typewriter message={fileMeta?.name} />
						</div>

						<div class="flex truncate">
							<strong class="mr-1">{m.smug_smart_giraffe_borrow()}</strong>
							<Typewriter message={prettyBytes(fileMeta?.size || 0)} />
						</div>
						<div class="flex truncate">
							<strong class="mr-1">{m.slow_free_lynx_spur()}</strong>
							<Typewriter message={fileMeta?.mimeType} />
						</div>
					</div>
				</div>

				<div
					class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full border border-foreground bg-background p-2 text-muted-foreground"
				>
					{#if isDownloading}
						<UploadSpinner class="rotate-180" />
					{:else}
						<Check class="text-success" />
					{/if}
				</div>
			</div>
			<div class="h-5 pt-1 text-muted-foreground">
				{#if isDownloading}
					<ProgressBar label={m.every_awful_guppy_fear()} progress={progress * 100} />
				{/if}
			</div>
		{:else}
			<!-- Secret Type: Text -->
			<Typewriter message={content} />
			<div class="flex justify-end pt-2">
				<Button data-sveltekit-reload href="/" class="mr-2" size="lg" variant="secondary"
					>{m.left_cool_raven_zap()}</Button
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

				<!-- For debugging -->
				{#if dev}
					<div class="py-3">
						<SuperDebug data={$formData} />
					</div>
				{/if}
			</form>
		</FormWrapper>
	{/if}
</div>

{#if content}
	<div class="pt-5">
		<Button data-sveltekit-reload href="/" class="mr-2" size="lg" variant="secondary"
			><Reply class="mr-2 h-4 w-4" />{m.giant_smug_lobster_clasp()}</Button
		>
	</div>
{/if}
