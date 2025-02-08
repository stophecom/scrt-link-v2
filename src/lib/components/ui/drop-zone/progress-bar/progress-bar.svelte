<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		progress: number;
		label?: string;
		class?: ClassValue;
	};

	let { label = m.due_lazy_bat_dance(), progress = 0, ...rest }: Props = $props();

	let derivedLabel = $derived(progress === 100 ? m.fancy_flaky_leopard_fade() : label);
</script>

<div class={['flex justify-between', rest.class]}>
	<div class="flex max-w-full flex-wrap items-baseline truncate text-base">
		<span class="mr-2 text-sm font-medium">{derivedLabel}</span>
	</div>
	<span class="ml-2 w-14 flex-shrink-0 text-right text-sm font-medium">{progress.toFixed(2)}%</span>
</div>
