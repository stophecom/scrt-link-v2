<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/client/utils.js';

	import type { HeadingLevel } from './index.js';

	type $$Props = HTMLAttributes<HTMLHeadingElement> & {
		level?: HeadingLevel;
	};

	let className: $$Props['class'] = undefined;
	export let level: $$Props['level'] = 'h5';
	export { className as class };
</script>

<svelte:element
	this={level}
	class={cn('py-1 leading-tight font-medium tracking-tight', className)}
	{...$$restProps}
>
	<slot />
</svelte:element>
