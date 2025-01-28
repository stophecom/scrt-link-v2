<script lang="ts">
	import { type Icon as IconType } from 'lucide-svelte';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import Info from 'lucide-svelte/icons/info';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils.js';

	import Description from './alert-description.svelte';
	import Title from './alert-title.svelte';
	import { alertVariants, type Variant } from './index.js';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		variant?: Variant;
		title?: string;
		Icon?: typeof IconType;
	};

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let title: $$Props['title'] = undefined;
	export let Icon: $$Props['Icon'] = undefined;
	export { className as class };

	$: SvelteIcon = Icon
		? Icon
		: variant === 'destructive'
			? CircleAlert
			: variant === 'success'
				? CircleCheck
				: Info;
</script>

<div class={cn(alertVariants({ variant }), className)} {...$$restProps} role="alert">
	<SvelteIcon class="h-4 w-4" />

	{#if title}
		<Title>{title}</Title>
	{/if}
	<Description class="[&>a]:underline"><slot /></Description>
</div>
