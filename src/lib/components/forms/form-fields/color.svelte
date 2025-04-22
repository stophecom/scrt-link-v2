<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import * as Form from '$lib/components/ui/form';
	import Markdown from '$lib/components/ui/markdown';

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
	<div
		class="ring-offset-background focus-within:ring-ring relative h-14 w-24 rounded focus-within:ring-2 focus-within:ring-offset-2"
		style="background-color: {value}"
	>
		<input
			{...attrs}
			class="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
			bind:value
			type="color"
			{...rest}
		/>
	</div>
	{#if description}
		<Form.Description><Markdown markdown={description} /></Form.Description>
	{/if}
</Form.Control>
<Form.FieldErrors />
