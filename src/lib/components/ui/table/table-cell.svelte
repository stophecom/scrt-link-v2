<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';

	import { cn } from '$lib/client/utils';

	type $$Props = HTMLTdAttributes;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<td
	class={cn('px-2 py-1 align-middle [&:has([role=checkbox])]:pr-0', className)}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</td>
