<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { slide } from 'svelte/transition';

	import { cn } from '$lib/client/utils.js';

	type $$Props = AccordionPrimitive.ContentProps;

	let className: $$Props['class'] = undefined;
	export let transition: $$Props['transition'] = slide;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 200
	};
	export { className as class };
</script>

<AccordionPrimitive.Content
	forceMount
	class={cn('overflow-hidden text-sm transition-all', className)}
	{...$$restProps}
>
	{#snippet child({ props, open }: { props: Record<string, unknown>; open: boolean })}
		{#if open}
			<div {...props} transition:transition={transitionConfig}>
				<div class="pt-0 pb-4">
					<slot />
				</div>
			</div>
		{/if}
	{/snippet}
</AccordionPrimitive.Content>
