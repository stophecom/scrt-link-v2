<script lang="ts">
	import Download from '@lucide/svelte/icons/download';

	import type { FileDownloader } from '$lib/client/file-download.svelte';
	import { formatBytes } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';

	import Button from '../ui/button/button.svelte';
	import FileRevelation from './file-revelation.svelte';

	type Props = { downloader: FileDownloader };

	let { downloader }: Props = $props();
</script>

{#if downloader.files.length > 1}
	<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
		<div class="text-muted-foreground text-sm">
			{m.flat_warm_file_summary({
				count: downloader.files.length,
				size: formatBytes(downloader.totalSize)
			})}
		</div>
		<Button
			size="sm"
			onclick={() => downloader.downloadAll()}
			disabled={downloader.isDownloading}
			data-testid="download-all-files"
		>
			<Download class="mr-2 h-4 w-4" />
			{m.flat_warm_file_download_all()}
		</Button>
	</div>
{/if}

<div class="space-y-3">
	{#each downloader.files as file (file.id)}
		<div>
			<FileRevelation {file} handleDownload={() => downloader.download(file)} />
			{#if file.error}
				<div class="text-destructive p-1 text-sm">{file.error}</div>
			{/if}
		</div>
	{/each}
</div>
