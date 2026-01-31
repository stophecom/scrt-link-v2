<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = DropdownMenuPrimitive.ItemProps & {
		inset?: boolean;
	};

	let className: $$Props['class'] = undefined;
	export let inset: $$Props['inset'] = undefined;
	export { className as class };
</script>

<DropdownMenuPrimitive.Item
	class={cn(
		'data-highlighted:bg-muted data-highlighted:text-foreground hover:bg-muted relative flex cursor-pointer items-center rounded-sm px-4 py-5 outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 sm:py-3',
		inset && 'pl-8',
		className
	)}
	{...$$restProps}
>
	<slot />
</DropdownMenuPrimitive.Item>
