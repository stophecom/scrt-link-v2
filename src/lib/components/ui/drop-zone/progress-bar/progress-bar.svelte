<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		progress: number;
	};

	let { progress = 0 }: Props = $props();

	let label = $derived(progress === 100 ? m.fancy_flaky_leopard_fade() : m.due_lazy_bat_dance());
</script>

<div class="mb-1 flex justify-between">
	<div class="flex max-w-full flex-wrap items-baseline truncate text-base dark:text-white">
		<span class="mr-2 text-sm font-medium">{label}</span>
	</div>
	<span class="ml-2 w-14 flex-shrink-0 text-right text-sm font-medium text-primary dark:text-white"
		>{progress.toFixed(2)}%</span
	>
</div>
