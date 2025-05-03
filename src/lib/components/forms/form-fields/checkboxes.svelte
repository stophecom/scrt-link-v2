<script lang="ts">
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

	function addItem(id: string) {
		value = [...value, id];
	}

	function removeItem(id: string) {
		value = value.filter((i: string) => i !== id);
	}
</script>

<div class="mb-4">
	<Form.Legend>{label}</Form.Legend>
	<Form.Description>{description}</Form.Description>
</div>
<div class="flex-wrap space-y-2 space-x-3 sm:flex">
	{#each items as item}
		{@const checked = value.includes(item.value)}

		<div class="flex flex-row items-center space-x-1">
			<Form.Control let:attrs>
				<Checkbox
					{...attrs}
					{checked}
					onCheckedChange={(v) => {
						if (v) {
							addItem(item.value);
						} else {
							removeItem(item.value);
						}
					}}
				/>
				<Form.Label class="font-normal">
					{item.label}
				</Form.Label>
				<input hidden type="checkbox" name={attrs.name} value={item.value} {checked} />
			</Form.Control>
		</div>
	{/each}
	<Form.FieldErrors />
</div>
