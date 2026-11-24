<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils';

	import { navigationMenuTriggerStyle } from './index.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.TriggerProps = $props();
</script>

<NavigationMenuPrimitive.Trigger
	bind:ref
	data-slot="navigation-menu-trigger"
	class={cn('group', navigationMenuTriggerStyle, className)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDown
		class="relative top-px h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
		aria-hidden="true"
	/>
</NavigationMenuPrimitive.Trigger>
