<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import { cn } from '$lib/client/utils';
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	type Option = {
		value: string;
		label: string;
		disabled?: boolean;
	};
	type Props = {
		label: string;
		options: Option[];
	};

	let { value = $bindable(), options, label }: Props & HTMLInputAttributes = $props();
</script>

<Form.Legend>{label}</Form.Legend>
<RadioGroup.Root bind:value class="px-1 md:flex">
	{#each options as option}
		<div class="flex items-center py-1 pe-3">
			<Form.Control let:attrs>
				<RadioGroup.Item value={option.value} {...attrs} disabled={!!option.disabled} />
				<Form.Label
					class={cn(
						'ml-0 cursor-pointer pl-2 font-normal',
						option.disabled ? 'text-muted-foreground' : undefined
					)}>{option.label}</Form.Label
				>
			</Form.Control>
		</div>
	{/each}
</RadioGroup.Root>
<Form.FieldErrors />
