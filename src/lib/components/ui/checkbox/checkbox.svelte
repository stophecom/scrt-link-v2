<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Minus from '@lucide/svelte/icons/minus';
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';
	import { elasticOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	import { cn } from '$lib/client/utils.js';

	type $$Props = CheckboxPrimitive.Props;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = CheckboxPrimitive.Events;

	let className: $$Props['class'] = undefined;
	export let checked: $$Props['checked'] = false;
	export { className as class };
</script>

<CheckboxPrimitive.Root
	class={cn(
		'peer border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground box-content h-6 w-6 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
		className
	)}
	bind:checked
	{...$$restProps}
	on:click
>
	<CheckboxPrimitive.Indicator
		class={cn('flex h-full w-full items-center justify-center text-current')}
		let:isChecked
		let:isIndeterminate
	>
		{#if isChecked}
			<div in:scale={{ easing: elasticOut, duration: 1000 }}>
				<Check class="h-4 w-4" />
			</div>
		{:else if isIndeterminate}
			<Minus class="h-4 w-4" />
		{/if}
	</CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
