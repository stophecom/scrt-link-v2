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

<div class="border-foreground bg-background rounded border">
	<ul class="divide-border max-h-72 divide-y overflow-y-auto">
		{#each downloader.files as file (file.id)}
			<FileRevelation {file} handleDownload={() => downloader.download(file)} />
		{/each}
	</ul>
</div>

{#if downloader.files.length > 1}
	<div class="flex flex-wrap items-center gap-3 pt-3">
		<div class="text-muted-foreground text-sm">
			{m.flat_warm_file_summary({
				count: downloader.files.length,
				size: formatBytes(downloader.totalSize)
			})}
		</div>
		<Button
			size="sm"
			class="ms-auto"
			onclick={() => downloader.downloadAll()}
			disabled={downloader.isDownloading}
			data-testid="download-all-files"
		>
			<Download class="mr-2 h-4 w-4" />
			{m.flat_warm_file_download_all()}
		</Button>
	</div>
{/if}
