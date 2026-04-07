<script lang="ts">
	import { Select as SelectBitsUI, type WithoutChildren } from 'bits-ui';

	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';

	type Option = {
		value: string;
		label: string;
		disabled?: boolean;
	};
	type Props = {
		label: string;
		options: Option[];
		value?: string;
		placeholder?: string;
		contentProps?: WithoutChildren<SelectBitsUI.ContentProps>;
	};

	let {
		value = $bindable(),
		options,
		label,
		contentProps,
		placeholder = 'Please select…',
		...restProps
	}: Props = $props();

	let selectedLabel = $derived(options.find((option) => option.value === value)?.label);
</script>

<Form.Control let:attrs>
	<Form.Label>{label}</Form.Label>
	<Select.Root type="single" bind:value={value as never} {...restProps}>
		<Select.Trigger aria-label={placeholder} class="min-w-60">
			<span class="truncate">{selectedLabel ?? placeholder}</span>
		</Select.Trigger>
		<Select.Content {...contentProps}>
			<SelectBitsUI.Viewport class="p-1">
				{#each options as option (option.value)}
					<Select.Item
						{...attrs}
						class="data-highlighted:bg-muted flex h-10 w-full cursor-pointer items-center rounded-md px-3 text-sm outline-hidden select-none data-disabled:opacity-50"
						value={option.value}
						label={option.label}
						disabled={option.disabled}
					></Select.Item>
				{/each}
			</SelectBitsUI.Viewport>
		</Select.Content>
	</Select.Root>
</Form.Control>
<Form.FieldErrors />
