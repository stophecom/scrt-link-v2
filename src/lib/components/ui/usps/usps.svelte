<script lang="ts">
	import Flame from 'lucide-svelte/icons/flame';
	import LockKeyhole from 'lucide-svelte/icons/lock-keyhole';
	import ShieldPlus from 'lucide-svelte/icons/shield-plus';

	// @todo: Extract
	const list = [
		{
			icon: LockKeyhole,
			text: 'End-to-end encrypted'
		},
		{
			icon: ShieldPlus,
			text: 'Swiss privacy'
		},
		{
			icon: Flame,
			text: 'Without a trace'
		}
	];
</script>

<div class="text-sm text-muted-foreground">
	{#each list as item}
		<div class="inline-flex items-center p-2">
			<item.icon class="mr-2 h-4 w-4 text-sm" />{item.text}
		</div>
	{/each}
</div>
