<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = DropdownMenuPrimitive.CheckboxItemProps;

	let className: $$Props['class'] = undefined;
	export let checked: $$Props['checked'] = undefined;
	export { className as class };
</script>

<DropdownMenuPrimitive.CheckboxItem
	bind:checked
	class={cn(
		'data-highlighted:bg-accent data-highlighted:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
		className
	)}
	{...$$restProps}
>
	{#snippet child({ checked })}
		<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			{#if checked}
				<Check class="h-4 w-4" />
			{/if}
		</span>
		<slot />
	{/snippet}
</DropdownMenuPrimitive.CheckboxItem>
