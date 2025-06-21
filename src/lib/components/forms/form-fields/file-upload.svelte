<script lang="ts">
	import Trash from '@lucide/svelte/icons/trash';
	import { onDestroy } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	import { PUBLIC_S3_CDN_BUCKET, PUBLIC_S3_ENDPOINT } from '$env/static/public';
	import { api } from '$lib/api';
	import { cn } from '$lib/client/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import DropZone from '$lib/components/ui/drop-zone/drop-zone.svelte';
	import * as Form from '$lib/components/ui/form';
	import Markdown from '$lib/components/ui/markdown';
	import { UploadSpinner } from '$lib/components/ui/spinner';
	import { MB } from '$lib/data/units';
	import { getFileExtension, type PresignedPostResponse, uploadFileToS3 } from '$lib/file-transfer';
	import { m } from '$lib/paraglide/messages.js';

	type Props = {
		label: string;
		description?: string;
		value?: string | null;
		labelButton?: string;
		labelDropzone?: string;
	};
	let {
		value = $bindable(),
		label,
		description,
		labelButton,
		labelDropzone,
		...rest
	}: Props & SvelteHTMLElements['div'] = $props();

	let inputElement: HTMLInputElement;
	let selectedFile: File | undefined = $state(undefined);
	let error = $state('');
	let loading = $state(false);

	let imageSrc = $derived(
		selectedFile && (selectedFile as File)?.type.startsWith('image/')
			? URL.createObjectURL(selectedFile)
			: value
				? `https://${PUBLIC_S3_CDN_BUCKET}.${PUBLIC_S3_ENDPOINT}/${value}`
				: undefined
	);

	let controller: AbortController | undefined;

	const postFile = async (file: File) => {
		controller = new AbortController();
		loading = true;

		const signal = controller.signal;

		const extension = getFileExtension(file);
		const fileName = `${crypto.randomUUID()}.${extension}`;

		const { url, fields } = await api<PresignedPostResponse>(
			`/files?name=${fileName}&type=${encodeURIComponent(file.type)}`
		);

		await uploadFileToS3({
			signal,
			url,
			fields,
			blob: file,
			size: file.size,
			progressCallback: (p) => {
				void console.log(p);
			}
		});

		value = fileName;
		loading = false;
	};

	const onDrop = async (files: File[]) => {
		selectedFile = files[0]; // We only accept one file
		await postFile(selectedFile);
	};

	const reset = () => {
		controller?.abort();
		selectedFile = undefined;
	};

	onDestroy(() => {
		reset();
	});
</script>

<Form.Control let:attrs>
	<Form.Label>{label}</Form.Label>
	<div>
		{#if imageSrc}
			<div class="grid grid-cols-[min-content_min-content] gap-2">
				<div class="relative">
					<img
						class={cn('max-h-full max-w-full object-contain', rest.class)}
						src={imageSrc}
						alt="Logo"
					/>

					{#if loading}
						<div
							transition:fade
							class="border-foreground bg-background text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border p-2"
						>
							<UploadSpinner />
						</div>
					{/if}
				</div>

				<Button
					size="icon"
					variant="outline"
					class="border-destructive"
					aria-label="Delete"
					on:click={async () => {
						value = null;
						reset();
						// We need to trigger change event.
						inputElement.dispatchEvent(new Event('change', { bubbles: true }));
					}}
				>
					<Trash class="text-destructive h-4 w-4" />
					<span class="sr-only">{m.least_moving_spider_roam()}</span>
				</Button>
			</div>
		{:else}
			<div class="inline-flex">
				<DropZone
					{labelButton}
					{labelDropzone}
					maxFileSize={10 * MB}
					{onDrop}
					accept="image/*"
					onError={(e) => {
						error = e;
					}}
				/>
			</div>
		{/if}

		{#if error}
			<div class="text-destructive p-1 text-sm">
				<Markdown markdown={error} />
			</div>
		{/if}
		<input type="hidden" {...attrs} bind:this={inputElement} bind:value />
	</div>
	{#if description}
		<Form.Description><Markdown markdown={description} /></Form.Description>
	{/if}
</Form.Control>

<Form.FieldErrors />
