<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import Check from 'lucide-svelte/icons/check';
	import type { HTMLInputAttributes } from 'svelte/elements';

	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { cn } from '$lib/utils.js';
	type Option = {
		value: string;
		label: string;
	};
	type Props = {
		label: string;
		options: Option[];
	};

	let { value = $bindable(), options, label }: Props & HTMLInputAttributes = $props();
</script>

<Form.Legend class="sr-only">{label}</Form.Legend>
<RadioGroup.Root bind:value class="px-1 md:flex">
	{#each options as option}
		<div class="flex items-center py-1 pe-3">
			<Form.Control let:attrs>
				<RadioGroupPrimitive.Item
					value={option.value}
					{...attrs}
					class={cn(
						'ring-offset-background focus-visible:ring-ring flex aspect-square h-12 w-12 items-center justify-center rounded-full focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
					)}
					style="background-color: var(--theme-color-{option.value});"
				>
					{#if value === option.value}
						<Check class="text-primary-foreground h-6 w-6" />
					{/if}
				</RadioGroupPrimitive.Item>

				<Form.Label class="sr-only">{option.label}</Form.Label>
			</Form.Control>
		</div>
	{/each}
</RadioGroup.Root>
<Form.FieldErrors />
