<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import X from 'lucide-svelte/icons/x';
	import { fly } from 'svelte/transition';

	import { cn } from '$lib/client/utils';

	import * as Dialog from './index.js';

	type $$Props = DialogPrimitive.ContentProps;

	let className: $$Props['class'] = undefined;
	export let transition: $$Props['transition'] = fly;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 200,
		y: 200
	};
	export { className as class };
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		{transition}
		{transitionConfig}
		class={cn(
			'bg-background border-border fixed bottom-0 left-[50%] z-50 grid max-h-screen w-full max-w-lg translate-x-[-50%] gap-4 p-6 shadow-lg sm:top-[50%] sm:bottom-auto sm:translate-y-[-50%] sm:rounded-lg sm:border md:w-full',
			className
		)}
		{...$$restProps}
	>
		<slot />
		<DialogPrimitive.Close
			class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
		>
			<X class="h-4 w-4" />
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close>
	</DialogPrimitive.Content>
</Dialog.Portal>
