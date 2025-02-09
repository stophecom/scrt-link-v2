<script lang="ts">
	import { type Icon as IconType } from 'lucide-svelte';

	type Props = {
		items: {
			icon: typeof IconType;
			text: string;
		}[];
	};
	let { items }: Props = $props();
</script>

<div class="flex flex-wrap items-center justify-center py-2 text-muted-foreground sm:justify-start">
	{#each items as item}
		<div class="inline-flex items-center px-2 py-1 text-sm">
			<item.icon class="mr-2 h-3 w-3  sm:h-4 sm:w-4" />{item.text}
		</div>
	{/each}
</div>
