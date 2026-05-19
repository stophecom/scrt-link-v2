<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';

	type Props = {
		label: string;
	};
	let { checked = $bindable(), label, ...rest }: Props & CheckboxPrimitive.RootProps = $props();
</script>

<Form.Control let:attrs>
	<div class="flex items-center">
		<Checkbox {...attrs} bind:checked {...rest} />
		<Form.Label class="ms-2 cursor-pointer text-sm leading-none font-medium">{label}</Form.Label>
	</div>
</Form.Control>
<Form.FieldErrors />
