<script lang="ts">
	import { Toggle as TogglePrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	import { type Size, toggleVariants, type Variant } from './index.js';

	type $$Props = TogglePrimitive.RootProps & {
		variant?: Variant;
		size?: Size;
	};

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let pressed: $$Props['pressed'] = undefined;
	export { className as class };
</script>

<TogglePrimitive.Root
	bind:pressed
	class={cn(toggleVariants({ variant, size }), className)}
	{...$$restProps}
>
	<slot />
</TogglePrimitive.Root>
