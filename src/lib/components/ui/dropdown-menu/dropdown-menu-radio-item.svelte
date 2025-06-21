<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = DropdownMenuPrimitive.RadioItemProps;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = DropdownMenuPrimitive.RadioItemEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export { className as class };
</script>

<DropdownMenuPrimitive.RadioItem
	class={cn(
		'data-highlighted:text-accent-foreground data-highlighted:bg-muted relative flex cursor-pointer items-center rounded-sm py-4 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 sm:py-3',
		className
	)}
	{value}
	{...$$restProps}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointerdown
	on:pointerleave
	on:pointermove
>
	<span class="absolute left-2 flex h-4 w-4 items-center justify-center">
		<DropdownMenuPrimitive.RadioIndicator>
			<Check class="text-primary h-4 w-4" />
		</DropdownMenuPrimitive.RadioIndicator>
	</span>
	<slot />
</DropdownMenuPrimitive.RadioItem>
