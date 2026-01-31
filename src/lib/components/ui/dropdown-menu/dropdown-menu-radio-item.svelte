<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = DropdownMenuPrimitive.RadioItemProps;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export { className as class };
</script>

<DropdownMenuPrimitive.RadioItem
	class={cn(
		'data-highlighted:text-accent-foreground data-highlighted:bg-muted hover:bg-muted hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm py-4 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 sm:py-3',
		className
	)}
	{value}
	{...$$restProps}
>
	{#snippet child({ props, checked })}
		<div {...props}>
			{#if checked}
				<span class="absolute left-2 flex h-4 w-4 items-center justify-center">
					<Check class="text-primary h-4 w-4" />
				</span>
			{/if}
			<slot />
		</div>
	{/snippet}
</DropdownMenuPrimitive.RadioItem>
