<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import * as Form from '$lib/components/ui/form';

	import Input from '../ui/input/input.svelte';
	import Markdown from '../ui/markdown';

	type Props = {
		label: string;
		description?: string;
	};

	let { value = $bindable(), label, description, ...rest }: Props & HTMLInputAttributes = $props();
</script>

<Form.Control let:attrs>
	<Form.Label>{label}</Form.Label>
	<Input {...attrs} bind:value {...rest} />
	{#if description}
		<Form.Description><Markdown markdown={description} /></Form.Description>
	{/if}
</Form.Control>
<Form.FieldErrors />
