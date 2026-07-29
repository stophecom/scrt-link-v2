<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Download from '@lucide/svelte/icons/download';
	import FileLock from '@lucide/svelte/icons/file-lock';

	import type { DownloadableFile } from '$lib/client/file-download.svelte';
	import Typewriter from '$lib/components/helpers/typewriter.svelte';
	import { formatBytes } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';

	import Button from '../ui/button/button.svelte';
	import UploadSpinner from '../ui/spinner/upload-spinner.svelte';

	type Props = { file: DownloadableFile; handleDownload?: () => void };

	let { file, handleDownload }: Props = $props();

	let isDownloading = $derived(file.status === 'downloading' && file.progress < 1);
	let isDownloadComplete = $derived(file.status === 'done');
	// The row fills up behind the content as the file downloads.
	let fillWidth = $derived(isDownloadComplete ? 100 : file.progress * 100);
</script>

<li class="relative flex items-center gap-3 p-3">
	<div
		class="bg-muted absolute top-0 left-0 h-full opacity-70"
		style="min-width: 0%; width: {fillWidth}%"
	></div>

	<div
		class="bg-muted relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded"
	>
		<FileLock class="text-muted-foreground h-5 w-5" />
	</div>

	<div class="relative min-w-0 grow">
		<div class="truncate" title={file.name}>
			<Typewriter mode="scramble" scrambleDuration={900} message={file.name} />
		</div>
		<div class="text-muted-foreground flex items-center gap-2 text-sm">
			<span class="shrink-0">{formatBytes(file.size)}</span>
			<span aria-hidden="true">·</span>
			{#if isDownloadComplete}
				<span class="text-success inline-flex shrink-0 items-center gap-1">
					{m.hour_tense_gecko_succeed()}
					<Check class="h-4 w-4" />
				</span>
			{:else if file.status === 'error'}
				<span class="text-destructive truncate">{file.error}</span>
			{:else if isDownloading}
				<span class="inline-flex shrink-0 items-center gap-1">
					{m.every_awful_guppy_fear()}
					<UploadSpinner class="rotate-180" />
				</span>
			{:else}
				<span class="truncate" title={file.mimeType}>{file.mimeType}</span>
			{/if}
		</div>
	</div>

	{#if handleDownload}
		{@const label = isDownloadComplete
			? m.flat_warm_resp_download_again()
			: m.flat_warm_resp_download_attachment()}
		<Button
			size="icon"
			class="border-foreground relative shrink-0"
			variant="ghost"
			title={label}
			aria-label={label}
			onclick={handleDownload}
			disabled={isDownloading}
			data-testid="download-attachment"
		>
			<Download class="h-5 w-5" />
		</Button>
	{/if}
</li>
