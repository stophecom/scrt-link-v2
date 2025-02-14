<script lang="ts">
	import Trash from 'lucide-svelte/icons/trash';
	import IconX from 'lucide-svelte/icons/x';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	import { PUBLIC_S3_BUCKET } from '$env/static/public';
	import { MB } from '$lib/data/units';
	import { handleFileEncryptionAndUpload } from '$lib/file-transfer';

	import type { SecretType } from '../forms/secret-form.svelte';
	import Button from '../ui/button/button.svelte';
	import DropZone from '../ui/drop-zone/drop-zone.svelte';
	import ProgressBar from '../ui/drop-zone/progress-bar/progress-bar.svelte';
	import { UploadSpinner } from '../ui/spinner';

	type Props = {
		secretType: SecretType;
		masterPassword: string;
		privateKey: CryptoKey;
		content: string;
		meta: string;
		loading: boolean;
		accept?: string;
	};
	let {
		accept,
		secretType,
		masterPassword,
		privateKey,
		content = $bindable(),
		meta = $bindable(),
		loading = $bindable()
	}: Props = $props();

	let selectedFile: File | null = $state(null);
	let progress = $state(0);
	let error = $state('');

	let done = $derived(progress === 100);

	const chunkSize = 64 * MB;
	let controllers = new Map<number, AbortController>(); // Track each request's AbortController

	const postSecret = async (file: File) => {
		loading = true;
		const bucket = PUBLIC_S3_BUCKET;

		const chunks = await handleFileEncryptionAndUpload({
			controllers,
			file,
			bucket,
			masterPassword,
			privateKey,
			chunkSize,
			progressCallback: (p) => {
				progress = p;
			}
		});

		const { name, size, type } = file;

		meta = JSON.stringify({
			secretType,
			name,
			size,
			mimeType: type,
			isSingleChunk: chunks.length === 1
		});

		content = JSON.stringify({ bucket, chunks });

		loading = false;
	};

	const onDrop = (files: File[]) => {
		selectedFile = files[0]; // We only accept one file
		postSecret(selectedFile);
	};

	const reset = () => {
		selectedFile = null;
		meta = '';
		content = '';

		controllers.forEach((controller) => controller.abort()); // Abort all requests
		controllers.clear();
	};

	onDestroy(() => {
		reset();
	});
</script>

{#if selectedFile}
	{@const fileName = selectedFile.name}

	<div
		class="border-foreground bg-background relative flex h-full items-center justify-center rounded border p-4"
	>
		<div
			class="bg-muted absolute left-0 h-full rounded"
			style="min-width: 0%; width: {progress}%"
		></div>

		{#if !done}
			<div
				transition:fade
				class="border-foreground bg-background text-muted-foreground absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border p-2"
			>
				<UploadSpinner />
			</div>
		{/if}
		<div class="relative flex max-w-full items-center">
			<div class="mr-2 truncate text-wrap">{fileName}</div>
			<Button
				size="icon"
				class="border-foreground"
				variant="ghost"
				aria-label="Delete"
				on:click={reset}
			>
				{#if done}
					<Trash class="text-destructive h-4 w-4" /> <span class="sr-only">Trash</span>
				{:else}
					<IconX class="text-destructive h-5 w-5" />
				{/if}
			</Button>
		</div>
	</div>
	{#if !done}
		<div class="text-muted-foreground pt-1">
			<ProgressBar {progress} />
		</div>
	{/if}
{:else}
	<DropZone
		{onDrop}
		{accept}
		onError={(e) => {
			error = e;
		}}
	/>
{/if}

{#if error}
	<div class="text-destructive p-1 text-sm">
		{error}
	</div>
{/if}
