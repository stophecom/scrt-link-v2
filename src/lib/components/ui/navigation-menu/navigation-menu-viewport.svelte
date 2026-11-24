<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils';

	let {
		ref = $bindable(null),
		class: className,
		offset = 0,
		...restProps
	}: NavigationMenuPrimitive.ViewportProps & { offset?: number } = $props();
</script>

<div
	class="absolute top-full left-0 isolate z-50 flex justify-center transition-transform duration-200 ease-out"
	style="transform: translateX({offset}px)"
>
	<NavigationMenuPrimitive.Viewport
		bind:ref
		data-slot="navigation-menu-viewport"
		class={cn(
			'bg-popover text-popover-foreground border-border relative mt-2 h-(--bits-navigation-menu-viewport-height) w-full origin-top overflow-hidden rounded-xl border opacity-100 shadow-lg transition-[width,height,opacity,transform] duration-200 ease-out md:w-(--bits-navigation-menu-viewport-width)',
			'data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
			className
		)}
		{...restProps}
	/>
</div>
