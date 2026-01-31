<script lang="ts">
	import Circle from '@lucide/svelte/icons/circle';
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = RadioGroupPrimitive.ItemProps;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export { className as class };
</script>

<RadioGroupPrimitive.Item
	{value}
	class={cn(
		'border-primary text-primary ring-offset-background focus-visible:ring-ring aspect-square h-6 w-6 rounded-full border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...$$restProps}
>
	{#snippet children({ checked }: { checked: boolean })}
		<div class="flex items-center justify-center">
			{#if checked}
				<Circle class="h-4 w-4 fill-current text-current" />
			{/if}
		</div>
	{/snippet}
</RadioGroupPrimitive.Item>
