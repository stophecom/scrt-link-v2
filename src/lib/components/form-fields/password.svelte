<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	// import type { SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import * as m from '$lib/paraglide/messages.js';

	import Input from '../ui/input/input.svelte';

	let { value = $bindable(), ...rest }: HTMLInputAttributes = $props();
</script>

<Form.Control let:attrs>
	<Form.Label class="sr-only">{m.yummy_fair_gazelle_link()}</Form.Label>
	<Input
		type="password"
		placeholder={m.yummy_fair_gazelle_link()}
		{...attrs}
		bind:value
		{...rest}
	/>
</Form.Control>
<Form.FieldErrors />
