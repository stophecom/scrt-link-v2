<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cubicOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	import { cn } from '$lib/client/utils.js';

	type ContentProps = DropdownMenuPrimitive.ContentProps;

	let className: ContentProps['class'] = undefined;
	export let sideOffset: ContentProps['sideOffset'] = 4;
	export { className as class };
</script>

<DropdownMenuPrimitive.Portal>
	<DropdownMenuPrimitive.Content {sideOffset} forceMount {...$$restProps}>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div
						{...props}
						transition:scale={{ start: 0.9, duration: 180, easing: cubicOut }}
						class={cn(
							'bg-popover text-popover-foreground border-border z-50 min-w-32 origin-(--bits-floating-transform-origin) rounded-md border p-1 shadow-md focus:outline-hidden',
							className
						)}
					>
						<slot />
					</div>
				</div>
			{/if}
		{/snippet}
	</DropdownMenuPrimitive.Content>
</DropdownMenuPrimitive.Portal>
