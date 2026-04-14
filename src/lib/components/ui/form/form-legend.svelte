<script lang="ts">
	import * as FormPrimitive from 'formsnap';

	import { cn } from '$lib/client/utils.js';

	type $$Props = FormPrimitive.LegendProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<FormPrimitive.Legend
	{...$$restProps}
	class={cn('data-fs-error:text-destructive pt-2 text-sm  font-medium', className)}
	let:legendAttrs
>
	<slot {legendAttrs} />
</FormPrimitive.Legend>
