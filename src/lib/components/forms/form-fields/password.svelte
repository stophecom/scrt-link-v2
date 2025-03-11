<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		isHiddenLabel?: boolean;
	};
	let {
		value = $bindable(),
		isHiddenLabel = false,
		...rest
	}: Props & HTMLInputAttributes = $props();
</script>

<Form.Control let:attrs>
	<Form.Label class={isHiddenLabel ? 'sr-only' : ''}>{m.yummy_fair_gazelle_link()}</Form.Label>
	<Input
		type="password"
		placeholder={m.yummy_fair_gazelle_link()}
		{...attrs}
		bind:value
		{...rest}
	/>
</Form.Control>
<Form.FieldErrors />
