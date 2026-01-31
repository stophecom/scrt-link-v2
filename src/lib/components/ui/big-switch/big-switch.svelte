<script lang="ts">
	import { Switch as SwitchPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = SwitchPrimitive.RootProps & { left: string; right: string };

	let { left, right, checked = $bindable(), ...rest }: $$Props = $props();
</script>

<SwitchPrimitive.Root
	bind:checked
	{...rest}
	class={cn(
		'peer focus-visible:ring-ring focus-visible:ring-offset-background bg-input relative inline-grid cursor-pointer grid-cols-2 items-center rounded-full border-4 border-transparent text-lg font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
		rest.class
	)}
>
	<SwitchPrimitive.Thumb
		class={cn(
			'bg-background pointer-events-none absolute block h-full w-1/2 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[100%] data-[state=unchecked]:translate-x-0'
		)}
	/>
	<div class="relative px-8 py-2">{left}</div>
	<div class="relative px-8 py-2">{right}</div>
</SwitchPrimitive.Root>
