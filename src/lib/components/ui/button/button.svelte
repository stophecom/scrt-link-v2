<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils.js';

	import Spinner from '../spinner/spinner.svelte';
	import { buttonVariants, type Props } from './index.js';

	let className: Props['class'] = undefined;
	export let variant: Props['variant'] = 'default';
	export let size: Props['size'] = 'default';
	export let delayed: Props['delayed'] = false;
	export { className as class };
</script>

<ButtonPrimitive.Root
	class={cn(buttonVariants({ variant, size }), className)}
	type="button"
	{...$$restProps}
>
	{#if variant === 'rainbow'}
		<span class="rainbow-button-label relative flex gap-1.5">
			{#if delayed}
				<Spinner class="mr-3 h-5 w-5" />
			{/if}
			<slot />
		</span>
	{:else}
		{#if delayed}
			<Spinner class="mr-3 h-5 w-5" />
		{/if}
		<slot />
	{/if}
</ButtonPrimitive.Root>

<style>
	@keyframes rainbow-rotate {
		from {
			--rainbow-angle: 0deg;
		}
		to {
			--rainbow-angle: 360deg;
		}
	}

	@property --rainbow-angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}

	:global(.rainbow-button) {
		position: relative;
		background: conic-gradient(
			from var(--rainbow-angle),
			#f97316,
			#ef4444,
			#ec4899,
			#8b5cf6,
			#3b82f6,
			#06b6d4,
			#10b981,
			#f97316
		);
		transition: box-shadow 0.3s ease;
		box-shadow: 0 0 0 rgba(139, 92, 246, 0);
	}

	:global(.rainbow-button)::before {
		content: '';
		position: absolute;
		left: 1.5px;
		top: 1.5px;
		bottom: 1.5px;
		right: 1.5px;
		background-color: hsl(var(--background));
		border-radius: 999px;
	}

	:global(.rainbow-button):hover {
		animation: rainbow-rotate 2s linear infinite;
		box-shadow:
			0 0 6px rgba(139, 92, 246, 0.2),
			0 0 12px rgba(236, 72, 153, 0.12);
	}

	:global(.rainbow-button):hover::before {
		opacity: 0.95;
	}
</style>
