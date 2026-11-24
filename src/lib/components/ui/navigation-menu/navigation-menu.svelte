<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils';

	import NavigationMenuViewport from './navigation-menu-viewport.svelte';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		class: className,
		viewport = true,
		viewportOffset = 0,
		children,
		...restProps
	}: NavigationMenuPrimitive.RootProps & { viewport?: boolean; viewportOffset?: number } = $props();
</script>

<NavigationMenuPrimitive.Root
	bind:ref
	bind:value
	data-slot="navigation-menu"
	class={cn('relative flex max-w-max flex-1 items-center justify-center', className)}
	{...restProps}
>
	{@render children?.()}
	{#if viewport}
		<NavigationMenuViewport offset={viewportOffset} />
	{/if}
</NavigationMenuPrimitive.Root>
