<script lang="ts">
	import * as FormPrimitive from 'formsnap';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/client/utils.js';

	type $$Props = HTMLAttributes<HTMLSpanElement>;
	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<FormPrimitive.Description
	class={cn('text-muted-foreground p-1 text-xs', className)}
	{...$$restProps}
	let:descriptionAttrs
>
	<slot {descriptionAttrs} />
</FormPrimitive.Description>
