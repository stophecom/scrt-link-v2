<script lang="ts">
	import { Label as LabelPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = LabelPrimitive.Props;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = LabelPrimitive.Events;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<LabelPrimitive.Root
	class={cn(
		'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	)}
	{...$$restProps}
	on:mousedown
>
	<slot />
</LabelPrimitive.Root>
