<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import * as Form from '$lib/components/ui/form';

	import Input from '../ui/input/input.svelte';
	import Markdown from '../ui/markdown';

	type Props = {
		label: string;
		description?: string;
		isHiddenLabel?: boolean;
	};

	let {
		value = $bindable(),
		label,
		isHiddenLabel,
		description,
		...rest
	}: Props & HTMLInputAttributes = $props();
</script>

<Form.Control let:attrs>
	<Form.Label class={isHiddenLabel ? 'sr-only' : ''}>{label}</Form.Label>
	<Input {...attrs} bind:value {...rest} />
	{#if description}
		<Form.Description><Markdown markdown={description} /></Form.Description>
	{/if}
</Form.Control>
<Form.FieldErrors />
