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

<div class="text-sm text-muted-foreground">
	{#each items as item}
		<div class="inline-flex items-center p-2">
			<item.icon class="mr-2 h-4 w-4 text-sm" />{item.text}
		</div>
	{/each}
</div>
