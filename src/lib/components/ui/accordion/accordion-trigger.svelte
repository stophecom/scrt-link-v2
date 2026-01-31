<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { Accordion as AccordionPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = AccordionPrimitive.TriggerProps;

	let className: $$Props['class'] = undefined;
	export let level: AccordionPrimitive.HeaderProps['level'] = 3;
	export { className as class };
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		class={cn(
			'flex flex-1 items-start justify-between py-4 text-start font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
			className
		)}
		{...$$restProps}
	>
		<slot />
		<ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" />
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
