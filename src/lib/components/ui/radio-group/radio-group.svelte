<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = RadioGroupPrimitive.Props;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export { className as class };
</script>

<RadioGroupPrimitive.Root bind:value class={cn('flex flex-wrap', className)} {...$$restProps}>
	<slot />
</RadioGroupPrimitive.Root>
