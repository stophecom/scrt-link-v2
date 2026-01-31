<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	import Spinner from '../spinner/spinner.svelte';
	import { buttonVariants, type Events, type Props } from './index.js';

	type $$Props = Props;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let delayed: $$Props['delayed'] = false;
	export { className as class };
</script>

<ButtonPrimitive.Root
	class={cn(buttonVariants({ variant, size }), className)}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	{#if delayed}
		<Spinner class="mr-3 h-5 w-5" />
	{/if}
	<slot />
</ButtonPrimitive.Root>
