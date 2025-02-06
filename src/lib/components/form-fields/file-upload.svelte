<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import Trash from 'lucide-svelte/icons/trash';
	import IconX from 'lucide-svelte/icons/x';
	import { onDestroy } from 'svelte';

	import { PUBLIC_S3_BUCKET } from '$env/static/public';
	import { MB } from '$lib/data/units';
	import { handleFileEncryptionAndUpload } from '$lib/file-transfer';

	import Button from '../ui/button/button.svelte';
	import DropZone from '../ui/drop-zone/drop-zone.svelte';
	import ProgressBar from '../ui/drop-zone/progress-bar/progress-bar.svelte';
	import { UploadSpinner } from '../ui/spinner';

	type Props = {
		masterPassword: string;
		privateKey: CryptoKey;
		content: string;
		meta: string;
		loading: boolean;
	};
	let {
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

	const chunkSize = 100 * MB;

	const postSecret = async (file: File) => {
		loading = true;
		const bucket = PUBLIC_S3_BUCKET;

		const chunks = await handleFileEncryptionAndUpload({
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
			secretType: 'file',
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
	};

	onDestroy(() => {
		reset();
	});
</script>

{#if selectedFile}
	{@const fileName = selectedFile.name}

	<div
		class="relative flex min-h-24 items-center justify-center rounded border border-foreground bg-background p-4"
	>
		<div
			class="absolute left-0 h-full rounded bg-muted"
			style="min-width: 0%; width: {progress}%"
		></div>

		{#if done}
			<Button
				class="absolute right-0 translate-x-1/2 rounded-full"
				size="icon"
				variant="outline"
				aria-label="Delete"
				on:click={reset}
			>
				<Trash class="h-4 w-4 text-destructive" /> <span class="sr-only">Trash</span>
			</Button>
		{:else}
			<div
				class="absolute right-0 translate-x-1/2 rounded-full border border-foreground bg-background p-2 text-muted-foreground"
			>
				<UploadSpinner />
			</div>
		{/if}
		<div class="relative flex items-center">
			<div class="mr-2 truncate">{fileName}</div>
			{#if done}
				<Check class="h-4 w-4 text-success" />
			{:else}
				<Button
					size="icon"
					class="border-foreground"
					variant="ghost"
					aria-label="Delete"
					on:click={reset}
				>
					{#if !done}
						<IconX class="h-4 w-4 text-destructive" /> <span class="sr-only">Trash</span>
					{/if}
				</Button>
			{/if}
		</div>
	</div>
	{#if !done}
		<ProgressBar {progress} />
	{/if}
{:else}
	<DropZone
		{onDrop}
		onError={(e) => {
			error = e;
		}}
	/>
{/if}

{#if error}
	<div class="p-1 text-sm text-destructive">
		{error}
	</div>
{/if}
