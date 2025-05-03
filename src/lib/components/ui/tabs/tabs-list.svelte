<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	type $$Props = TabsPrimitive.ListProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<TabsPrimitive.List
	class={cn('text-muted-foreground inline-flex h-10 items-center rounded-md', className)}
	{...$$restProps}
>
	<slot />
</TabsPrimitive.List>
