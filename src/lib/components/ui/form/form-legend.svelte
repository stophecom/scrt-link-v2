<script lang="ts">
	import * as FormPrimitive from 'formsnap';

	import { cn } from '$lib/utils.js';

	type $$Props = FormPrimitive.LegendProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<FormPrimitive.Legend
	{...$$restProps}
	class={cn('data-fs-error:text-destructive px-1 pt-4 text-sm leading-none font-medium', className)}
	let:legendAttrs
>
	<slot {legendAttrs} />
</FormPrimitive.Legend>
