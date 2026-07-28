<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import FileIcon from '@lucide/svelte/icons/file';
	import Trash from '@lucide/svelte/icons/trash';
	import IconX from '@lucide/svelte/icons/x';
	import { onDestroy } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { fade } from 'svelte/transition';

	import { PUBLIC_S3_BUCKET } from '$env/static/public';
	import { CHUNK_SIZE } from '$lib/client/constants';
	import Button from '$lib/components/ui/button/button.svelte';
	import DropZone from '$lib/components/ui/drop-zone/drop-zone.svelte';
	import ProgressBar from '$lib/components/ui/drop-zone/progress-bar/progress-bar.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import { UploadSpinner } from '$lib/components/ui/spinner';
	import { SecretType } from '$lib/data/enums';
	import {
		createUploadSemaphore,
		handleFileEncryptionAndUpload,
		type SecretFileEntry,
		UPLOAD_CONCURRENCY
	} from '$lib/file-transfer';
	import { formatBytes } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';

	type Props = {
		accept?: string;
		// Size budget for the whole secret, from the user's plan.
		maxFileSize?: number;
		multiple?: boolean;
		secretType: SecretType;
		masterKey: string;
		privateKey: CryptoKey;
		content: string;
		meta: string;
		loading: boolean;
	};
	let {
		accept,
		maxFileSize,
		multiple = false,
		secretType,
		masterKey,
		privateKey,
		content = $bindable(),
		meta = $bindable(),
		loading = $bindable()
	}: Props = $props();

	type UploadItem = {
		id: string;
		file: File;
		previewUrl?: string;
		progress: number;
		status: 'uploading' | 'done' | 'error';
		error?: string;
		chunks?: SecretFileEntry['chunks'];
	};

	let items: UploadItem[] = $state([]);
	let error = $state('');

	// One shared limiter across every file, so N files don't open
	// N × UPLOAD_CONCURRENCY connections at once.
	const semaphore = createUploadSemaphore(UPLOAD_CONCURRENCY);
	// Keyed `${itemId}:${chunkIndex}` — chunk indices repeat across files.
	let controllers = new SvelteMap<string, AbortController>();

	let selectedSize = $derived(items.reduce((total, item) => total + item.file.size, 0));
	let isUploading = $derived(items.some((item) => item.status === 'uploading'));
	let remainingSize = $derived(maxFileSize ? Math.max(maxFileSize - selectedSize, 0) : 0);

	// Blocks form submission while anything is still in flight.
	$effect(() => {
		loading = isUploading;
	});

	// Items are read back out of the `$state` array so we always work with the
	// reactive proxy — mutating the raw object we pushed in wouldn't update the UI.
	const itemById = (id: string) => items.find((item) => item.id === id);

	const syncFormFields = () => {
		const completed = items.filter((item) => item.status === 'done' && item.chunks?.length);

		if (!completed.length) {
			meta = '';
			content = '';
			return;
		}

		const files: SecretFileEntry[] = completed.map(({ id, file, chunks }) => ({
			id,
			name: file.name,
			size: file.size,
			mimeType: file.type || 'application/octet-stream',
			isSingleChunk: chunks!.length === 1,
			chunks: chunks!
		}));

		meta = JSON.stringify({
			secretType,
			fileCount: files.length,
			totalSize: files.reduce((total, file) => total + file.size, 0)
		});

		content = JSON.stringify({ bucket: PUBLIC_S3_BUCKET, files });
	};

	const upload = async (id: string) => {
		const item = itemById(id);
		if (!item) {
			return;
		}

		try {
			const chunks = await handleFileEncryptionAndUpload({
				controllers,
				semaphore,
				uploadId: id,
				file: item.file,
				masterKey,
				privateKey,
				chunkSize: CHUNK_SIZE,
				progressCallback: (progress) => {
					const current = itemById(id);
					if (current) {
						current.progress = progress;
					}
				}
			});

			const current = itemById(id);
			if (!current) {
				return; // Removed mid-upload.
			}

			current.chunks = chunks;
			current.status = 'done';
			current.progress = 100;
		} catch (e) {
			const current = itemById(id);
			// An aborted upload means the user removed the file — nothing to report.
			if (!current) {
				return;
			}

			console.error('[FileUpload] handleFileEncryptionAndUpload failed:', e);
			current.status = 'error';
			current.error = e instanceof Error ? e.message : String(e);
		} finally {
			syncFormFields();
		}
	};

	/** Rejects a selection that would push the secret over the plan's size budget. */
	const validateTotalSize = (files: File[]) => {
		if (!maxFileSize) {
			return null;
		}

		const incoming = files.reduce((total, file) => total + file.size, 0);

		return selectedSize + incoming > maxFileSize
			? m.flat_warm_file_total_limit({ amount: formatBytes(maxFileSize) })
			: null;
	};

	const onDrop = (files: File[]) => {
		if (!multiple) {
			reset();
		}

		const added: UploadItem[] = (multiple ? files : files.slice(0, 1)).map((file) => ({
			id: crypto.randomUUID(),
			file,
			previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
			progress: 0,
			status: 'uploading'
		}));

		items = [...items, ...added];
		added.forEach(({ id }) => upload(id));
	};

	const discard = (item: UploadItem) => {
		for (const [key, controller] of controllers) {
			if (key.startsWith(`${item.id}:`)) {
				controller.abort();
				controllers.delete(key);
			}
		}

		if (item.previewUrl) {
			URL.revokeObjectURL(item.previewUrl);
		}
	};

	const remove = (id: string) => {
		const item = itemById(id);
		if (!item) {
			return;
		}

		items = items.filter((entry) => entry.id !== id);
		discard(item);
		error = '';
		syncFormFields();
	};

	const reset = () => {
		items.forEach(discard);
		items = [];
		error = '';
		syncFormFields();
	};

	onDestroy(() => {
		reset();
	});
</script>

{#if items.length}
	<div class="border-foreground bg-background rounded border">
		<ul class="divide-border max-h-72 divide-y overflow-y-auto">
			{#each items as item (item.id)}
				<li class="relative flex items-center gap-3 p-3">
					<div
						class="bg-muted absolute top-0 left-0 h-full opacity-70"
						style="min-width: 0%; width: {item.status === 'done' ? 100 : item.progress}%"
					></div>

					<div
						class="bg-muted relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded"
					>
						{#if item.previewUrl}
							<img class="h-full w-full object-cover" src={item.previewUrl} alt="" />
						{:else}
							<FileIcon class="text-muted-foreground h-5 w-5" />
						{/if}
					</div>

					<div class="relative min-w-0 grow">
						<div class="truncate" title={item.file.name}>{item.file.name}</div>
						<div class="text-muted-foreground flex items-center gap-2 text-sm">
							<span>{formatBytes(item.file.size)}</span>
							<span aria-hidden="true">·</span>
							{#if item.status === 'done'}
								<span class="text-success inline-flex items-center gap-1">
									{m.fancy_flaky_leopard_fade()}
									<Check class="h-4 w-4" />
								</span>
							{:else if item.status === 'error'}
								<span class="text-destructive truncate">{item.error}</span>
							{:else}
								<span transition:fade class="inline-flex items-center gap-1">
									{m.due_lazy_bat_dance()}
									<UploadSpinner />
								</span>
							{/if}
						</div>
					</div>

					<Button
						size="icon"
						class="border-foreground relative shrink-0"
						variant="ghost"
						aria-label={m.least_moving_spider_roam()}
						onclick={() => remove(item.id)}
					>
						<IconX class="text-destructive h-5 w-5" />
					</Button>
				</li>
			{/each}
		</ul>
	</div>

	{#if isUploading}
		<div class="text-muted-foreground pt-1">
			<ProgressBar
				progress={items.reduce((total, item) => total + item.progress, 0) / items.length}
			/>
		</div>
	{/if}

	<div class="flex flex-wrap items-center gap-3 pt-3">
		{#if multiple}
			<DropZone
				variant="compact"
				{multiple}
				{maxFileSize}
				{onDrop}
				{accept}
				validate={validateTotalSize}
				onError={(e) => {
					error = e;
				}}
			/>
		{/if}

		<div class="text-muted-foreground flex items-center gap-1 text-sm">
			<span data-testid="file-upload-summary">
				{items.length === 1
					? m.flat_warm_file_summary_one({ size: formatBytes(selectedSize) })
					: m.flat_warm_file_summary({ count: items.length, size: formatBytes(selectedSize) })}
			</span>
			<Button
				size="icon"
				variant="ghost"
				aria-label={m.flat_warm_file_remove_all()}
				onclick={reset}
			>
				<Trash class="text-destructive h-4 w-4" />
			</Button>
		</div>

		{#if maxFileSize}
			<div class="text-muted-foreground ms-auto text-sm">
				{m.flat_warm_file_available({ amount: formatBytes(remainingSize) })}
			</div>
		{/if}
	</div>
{:else}
	<DropZone
		labelButton={secretType === SecretType.SNAP ? m.slimy_close_frog_laugh() : undefined}
		labelDropzone={secretType === SecretType.SNAP ? m.jolly_whole_hyena_slurp() : undefined}
		{multiple}
		{maxFileSize}
		{onDrop}
		{accept}
		validate={validateTotalSize}
		onError={(e) => {
			error = e;
		}}
	/>
{/if}

{#if error}
	<div class="text-destructive p-1 text-sm">
		<Markdown markdown={error} />
	</div>
{/if}
