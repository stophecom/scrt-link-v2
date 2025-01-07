<script lang="ts">
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils.js';

	import Description from './alert-description.svelte';
	import Title from './alert-title.svelte';
	import { alertVariants, type Variant } from './index.js';
	type $$Props = HTMLAttributes<HTMLDivElement> & {
		variant?: Variant;
		title?: string;
	};

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let title: $$Props['title'] = undefined;
	export { className as class };
</script>

<div class={cn(alertVariants({ variant }), className)} {...$$restProps} role="alert">
	{#if variant === 'destructive'}
		<CircleAlert class="h-4 w-4" />
	{:else}
		<CircleCheck class="h-4 w-4" />
	{/if}
	{#if title}
		<Title>{title}</Title>
	{/if}
	<Description class="[&>a]:underline"><slot /></Description>
</div>
