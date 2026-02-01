<script lang="ts">
	import { Checkbox as CheckboxBits } from 'bits-ui';
	import type { HTMLInputAttributes } from 'svelte/elements';

	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Form from '$lib/components/ui/form';

	type CheckboxItem = { value: string; label: string };
	type Props = {
		label: string;
		description?: string;
		items: CheckboxItem[];
	};

	let { value = $bindable(), label, description, items }: Props & HTMLInputAttributes = $props();
</script>

<div class="mb-4">
	<Form.Legend>{label}</Form.Legend>
	<Form.Description>{description}</Form.Description>
</div>

<CheckboxBits.Group
	bind:value
	class="flex-wrap items-center space-y-2 space-x-3 sm:flex sm:space-y-0"
>
	{#each items as item (item.value)}
		{@const checked = value.includes(item.value)}

		<div class="flex flex-row items-center space-x-1">
			<Form.Control let:attrs>
				<Checkbox {...attrs} {checked} value={item.value} />
				<Form.Label class="font-normal">
					{item.label}
				</Form.Label>
			</Form.Control>
		</div>
	{/each}
</CheckboxBits.Group>
<Form.FieldErrors />
