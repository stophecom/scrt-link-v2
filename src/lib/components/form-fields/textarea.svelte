<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	import * as Form from '$lib/components/ui/form';

	import Textarea from '../ui/textarea/textarea.svelte';

	type Props = {
		charactersLeft: number;
		hideLabel?: boolean;
		label: string;
	};
	let {
		value = $bindable(),
		hideLabel = false,
		charactersLeft,
		label,
		...rest
	}: Props & HTMLTextareaAttributes = $props();
</script>

<Form.Control let:attrs>
	<Form.Label class={hideLabel ? 'sr-only' : ''}>{label}</Form.Label>
	<div class="relative">
		<Textarea class="resize-none" {...attrs} bind:value {...rest} />
		<span
			class="absolute bottom-1 right-1 text-xs {charactersLeft < 0
				? 'text-destructive'
				: 'text-muted-foreground'}"
			>{charactersLeft}
		</span>
	</div>
</Form.Control>
<Form.FieldErrors />
