<script lang="ts">
	import { Switch as SwitchPrimitive } from 'bits-ui';

	import * as Form from '$lib/components/ui/form';
	import { Switch } from '$lib/components/ui/switch';

	type Props = {
		label: string;
	};
	let { checked = $bindable(), label, ...rest }: Props & SwitchPrimitive.Props = $props();
</script>

<Form.Control let:attrs>
	<div class="flex items-center">
		<Switch {...attrs} bind:checked {...rest} />
		<Form.Label class="ms-2 cursor-pointer text-base">{label}</Form.Label>
	</div>
</Form.Control>
<Form.FieldErrors />
