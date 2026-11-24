<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.ContentProps = $props();
</script>

<NavigationMenuPrimitive.Content
	bind:ref
	data-slot="navigation-menu-content"
	class={cn(
		'w-full transition-[opacity,transform] duration-200 ease-out',
		'data-ending-style:-translate-x-2 data-ending-style:opacity-0 data-starting-style:translate-x-2 data-starting-style:opacity-0',
		className
	)}
	{...restProps}
/>
