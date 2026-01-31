<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	import { cn, flyAndScale } from '$lib/client/utils.js';

	type $$Props = DropdownMenuPrimitive.SubContentProps;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = DropdownMenuPrimitive.SubContentEvents;

	let className: $$Props['class'] = undefined;
	export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = {
		x: -10,
		y: 0
	};
	export { className as class };
</script>

<DropdownMenuPrimitive.Portal>
	<DropdownMenuPrimitive.SubContent
		forceMount
		class={cn(
			'bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-lg focus:outline-hidden',
			className
		)}
		{...$$restProps}
		on:keydown
		on:focusout
		on:pointermove
	>
		{#snippet child({ props, open }: { props: Record<string, unknown>; open: boolean })}
			{#if open}
				<div {...props} transition:transition={transitionConfig}>
					<slot />
				</div>
			{/if}
		{/snippet}
	</DropdownMenuPrimitive.SubContent>
</DropdownMenuPrimitive.Portal>
