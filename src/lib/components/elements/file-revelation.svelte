<script lang="ts">
	import { Check } from 'lucide-svelte';
	import FileLock from 'lucide-svelte/icons/file-lock';

	import Typewriter from '$lib/components/helpers/typewriter.svelte';
	import type { FileMeta } from '$lib/file-transfer';
	import { formatBytes } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';

	import ProgressBar from '../ui/drop-zone/progress-bar/progress-bar.svelte';
	import UploadSpinner from '../ui/spinner/upload-spinner.svelte';

	type Props = { progress: number; fileMeta: FileMeta };

	let { progress, fileMeta }: Props = $props();

	let isDownloading = $derived(progress < 1);
</script>

<h3 class="mb-2 pt-4 text-2xl font-semibold">{m.house_warm_fox_transform()}</h3>
<p class="mb-3">
	{m.helpful_mean_salmon_slurp()}
</p>

<div class="border-foreground bg-background relative min-h-24 rounded border p-4">
	<div
		class="bg-muted absolute top-0 left-0 h-full rounded"
		style="min-width: 0%; width: {progress * 100}%"
	></div>

	<div class="relative grid grid-cols-[min-content_1fr] gap-4">
		<div class="flex items-center">
			<FileLock class="text-primary h-10 w-10 stroke-1" />
		</div>

		<div class="overflow-hidden">
			<div class="flex truncate">
				<strong class="mr-1">{m.suave_level_squirrel_hope()}</strong>
				<Typewriter message={fileMeta?.name} />
			</div>

			<div class="flex truncate">
				<strong class="mr-1">{m.smug_smart_giraffe_borrow()}</strong>
				<Typewriter message={formatBytes(fileMeta?.size || 0)} />
			</div>
			<div class="flex truncate">
				<strong class="mr-1">{m.slow_free_lynx_spur()}</strong>
				<Typewriter message={fileMeta?.mimeType} />
			</div>
		</div>
	</div>

	<div
		class="border-foreground bg-background text-muted-foreground absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 rounded-full border p-2"
	>
		{#if isDownloading}
			<UploadSpinner class="rotate-180" />
		{:else}
			<Check class="text-success" />
		{/if}
	</div>
</div>
<div class="text-muted-foreground h-5 pt-1">
	<ProgressBar
		labelInProgress={m.every_awful_guppy_fear()}
		labelComplete={m.hour_tense_gecko_succeed()}
		progress={progress * 100}
	/>
</div>
