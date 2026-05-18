<script lang="ts">
	import { Check, Download } from '@lucide/svelte';
	import FileLock from '@lucide/svelte/icons/file-lock';
	import { fade } from 'svelte/transition';

	import Typewriter from '$lib/components/helpers/typewriter.svelte';
	import type { FileMeta } from '$lib/file-transfer';
	import { formatBytes } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';

	import Button from '../ui/button/button.svelte';
	import ProgressBar from '../ui/drop-zone/progress-bar/progress-bar.svelte';
	import UploadSpinner from '../ui/spinner/upload-spinner.svelte';

	type Props = { progress: number; fileMeta: FileMeta; handleDownload?: () => void };

	let { progress, fileMeta, handleDownload }: Props = $props();

	let isDownloading = $derived(progress > 0 && progress < 1);
	let isDownloadComplete = $derived(progress === 1);
</script>

<div class="border-foreground bg-background relative min-h-24 rounded border p-4">
	<div
		class="bg-muted absolute top-0 left-0 h-full rounded"
		style="min-width: 0%; width: {progress * 100}%"
	></div>

	<div class="relative flex flex-wrap items-center gap-4">
		<div class="grid grid-cols-[min-content_1fr] gap-4">
			<div class="flex min-w-12 items-center justify-center">
				{#if isDownloading}
					<div
						transition:fade
						class="border-foreground bg-background text-muted-foreground rounded-full border p-2"
					>
						<UploadSpinner class="rotate-180" />
					</div>
				{:else if isDownloadComplete}
					<div
						transition:fade
						class="border-foreground bg-background text-muted-foreground rounded-full border p-2"
					>
						<Check class="text-success" />
					</div>
				{:else}
					<FileLock class="text-primary h-10 w-10 stroke-1" />
				{/if}
			</div>

			<div class="overflow-hidden">
				<div class="flex truncate">
					<strong class="mr-1">{m.suave_level_squirrel_hope()}</strong>
					<Typewriter mode="scramble" scrambleDuration={900} message={fileMeta?.name} />
				</div>

				<div class="flex truncate">
					<strong class="mr-1">{m.smug_smart_giraffe_borrow()}</strong>
					<Typewriter
						mode="scramble"
						scrambleDuration={900}
						message={formatBytes(fileMeta?.size || 0)}
					/>
				</div>
				<div class="flex truncate">
					<strong class="mr-1">{m.slow_free_lynx_spur()}</strong>
					<Typewriter mode="scramble" scrambleDuration={900} message={fileMeta?.mimeType} />
				</div>
			</div>
		</div>
		{#if handleDownload}
			<Button
				class="xs:w-auto ms-auto w-full"
				onclick={handleDownload}
				disabled={isDownloading}
				data-testid="download-attachment"
			>
				<Download class="mr-2 h-4 w-4" />
				{#if isDownloadComplete}
					{m.flat_warm_resp_download_again()}
				{:else}
					{m.flat_warm_resp_download_attachment()}
				{/if}
			</Button>
		{/if}
	</div>
</div>
{#if isDownloading || isDownloadComplete}
	<div class="text-muted-foreground h-5 pt-1">
		<ProgressBar
			labelInProgress={m.every_awful_guppy_fear()}
			labelComplete={m.hour_tense_gecko_succeed()}
			progress={progress * 100}
		/>
	</div>
{/if}
