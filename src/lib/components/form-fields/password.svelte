<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import * as Form from '$lib/components/ui/form';
	import * as m from '$lib/paraglide/messages.js';

	import Input from '../ui/input/input.svelte';

	type Props = {
		hideLabel?: boolean;
	};
	let { value = $bindable(), hideLabel = false, ...rest }: Props & HTMLInputAttributes = $props();
</script>

<Form.Control let:attrs>
	<Form.Label class={hideLabel ? 'sr-only' : ''}>{m.yummy_fair_gazelle_link()}</Form.Label>
	<Input
		type="password"
		placeholder={m.yummy_fair_gazelle_link()}
		{...attrs}
		bind:value
		{...rest}
	/>
</Form.Control>
<Form.FieldErrors />
