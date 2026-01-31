<script lang="ts">
	import { Switch as SwitchPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = SwitchPrimitive.RootProps; // Use the exported type instead

	let className: $$Props['class'] = undefined;
	export let checked: $$Props['checked'] = undefined;
	export { className as class };
</script>

<SwitchPrimitive.Root
	bind:checked
	class={cn(
		'peer focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...$$restProps}
>
	<SwitchPrimitive.Thumb
		class={cn(
			'bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
		)}
	/>
</SwitchPrimitive.Root>
