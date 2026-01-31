<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = DropdownMenuPrimitive.GroupHeadingProps & {
		inset?: boolean;
	};

	let className: $$Props['class'] = undefined;
	export let inset: $$Props['inset'] = undefined;
	export { className as class };
</script>

<DropdownMenuPrimitive.GroupHeading
	class={cn('px-2 py-3 text-sm font-semibold', inset && 'pl-8', className)}
	{...$$restProps}
>
	<slot />
</DropdownMenuPrimitive.GroupHeading>
