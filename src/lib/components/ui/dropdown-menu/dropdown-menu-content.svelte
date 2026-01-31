<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type ContentProps = DropdownMenuPrimitive.ContentProps;

	let className: ContentProps['class'] = undefined;
	export let sideOffset: ContentProps['sideOffset'] = 4;
	export { className as class };
</script>

<DropdownMenuPrimitive.Portal>
	<DropdownMenuPrimitive.Content
		{sideOffset}
		class={cn(
			'bg-popover text-popover-foreground border-border z-50 min-w-[8rem] rounded-md border p-1 shadow-md focus:outline-hidden',
			className
		)}
		{...$$restProps}
	>
		<slot />
	</DropdownMenuPrimitive.Content>
</DropdownMenuPrimitive.Portal>
