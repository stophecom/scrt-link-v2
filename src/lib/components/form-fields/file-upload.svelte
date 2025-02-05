<script lang="ts">
	import Paperclip from 'lucide-svelte/icons/paperclip';
	import Trash from 'lucide-svelte/icons/trash';
	import { onDestroy } from 'svelte';

	import { PUBLIC_S3_BUCKET } from '$env/static/public';
	import { MB } from '$lib/data/units';
	import { handleFileEncryptionAndUpload } from '$lib/file-transfer';
	import { encryptString } from '$lib/web-crypto';

	import Button from '../ui/button/button.svelte';
	import DropZone from '../ui/drop-zone/drop-zone.svelte';
	import ProgressBar from '../ui/drop-zone/progress-bar/progress-bar.svelte';

	let selectedFile: File | null = $state(null);
	let progress = $state(0);
	let error = $state('');

	type OnUploadSuccess = ({ content, meta }: { content: string; meta: string }) => void;

	type Props = {
		masterPassword: string;
		privateKey: CryptoKey;
		isUploading: boolean;
		onUploadSuccess: OnUploadSuccess;
	};
	let { masterPassword, privateKey, isUploading, onUploadSuccess }: Props = $props();

	const chunkSize = 100 * MB;

	async function postSecret(file: File) {
		const bucket = PUBLIC_S3_BUCKET;

		const chunks = await handleFileEncryptionAndUpload({
			file,
			bucket,
			masterPassword,
			privateKey,
			chunkSize,
			progressCallback: (p) => {
				console.log(p);
				// progress = p;
			}
		});

		const { name, size, type } = file;

		const meta = await encryptString(
			JSON.stringify({
				secretType: 'file',
				name,
				size,
				mimeType: type,
				isSingleChunk: chunks.length === 1
			}),
			masterPassword
		);
		const content = await encryptString(JSON.stringify({ bucket, chunks }), masterPassword);

		onUploadSuccess({ meta, content });
	}

	const onDrop = (files: File[]) => {
		selectedFile = files[0]; // We only accept one file
	};

	const reset = () => {
		selectedFile = null;
	};

	onDestroy(async () => {
		reset();
	});
</script>

{#if selectedFile}
	{@const fileName = selectedFile.name}

	<div
		class="relative flex items-center justify-center rounded border border-foreground bg-background p-4"
	>
		<div
			class="absolute left-0 h-full rounded bg-muted"
			style="min-width: 0%; width: {progress}%"
		></div>
		<Paperclip
			class="absolute left-0 mr-2 h-9 w-9 -translate-x-1/2 rounded-full border border-foreground bg-background p-2 text-muted-foreground"
		/>
		<div class="mr-2 truncate">{fileName}</div>
		<Button size="icon" variant="ghost" aria-label="Delete" on:click={reset}
			><Trash class="h-4 w-4 text-destructive" /> <span class="sr-only">Trash</span></Button
		>
	</div>

	{#if isUploading}
		{#await postSecret(selectedFile)}
			<ProgressBar {progress} />
		{:catch e}
			{(error = e?.message)}
		{/await}
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
