<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { fade } from 'svelte/transition';

	import { cn } from '$lib/client/utils';

	type $$Props = DialogPrimitive.OverlayProps;

	let className: $$Props['class'] = undefined;
	export let transition: $$Props['transition'] = fade;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 150
	};
	export { className as class };
</script>

<DialogPrimitive.Overlay forceMount {...$$restProps}>
	{#snippet child({ props, open }: { props: Record<string, unknown>; open: boolean })}
		{#if open}
			<div
				class={cn('bg-foreground/50 fixed inset-0 z-50 backdrop-blur-sm', className)}
				transition:transition={transitionConfig}
				{...props}
			></div>
		{/if}
	{/snippet}
</DialogPrimitive.Overlay>
