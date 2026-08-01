<script lang="ts">
	import type { Icon as IconType } from '@lucide/svelte';
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';

	import { cn } from '$lib/client/utils';

	type Option = {
		value: string;
		label: string;
		icon?: typeof IconType;
	};
	type Props = {
		label: string;
		options: Option[];
		value?: string;
		class?: string;
	};

	let { value = $bindable(), options, label, class: className }: Props = $props();
</script>

<div class={cn('flex flex-col', className)}>
	<span class="pb-2 text-sm leading-none font-medium">{label}</span>
	<RadioGroupPrimitive.Root
		bind:value
		aria-label={label}
		class="flex rounded-md border p-1"
		orientation="horizontal"
	>
		{#each options as option (option.value)}
			<RadioGroupPrimitive.Item
				value={option.value}
				data-testid="segment-{option.value}"
				class="ring-offset-background hover:bg-muted/60 focus-visible:ring-ring data-[state=checked]:bg-muted data-[state=checked]:text-foreground text-muted-foreground inline-flex flex-1 basis-0 cursor-pointer items-center justify-center gap-2 rounded-sm px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden data-[state=checked]:shadow-xs sm:px-3"
			>
				{#if option.icon}
					{@const Icon = option.icon}
					<Icon class="h-4 w-4" />
				{/if}
				{option.label}
			</RadioGroupPrimitive.Item>
		{/each}
	</RadioGroupPrimitive.Root>
</div>
