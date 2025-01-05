<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';

	import { cn } from '$lib/utils.js';

	import { buttonVariants, type Events, type Props } from './index.js';

	type $$Props = Props;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export let delayed: $$Props['delayed'] = false;
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size }), className)}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	{#if delayed}
		<span
			class="mr-3 block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
		></span>
	{/if}
	<slot />
</ButtonPrimitive.Root>
