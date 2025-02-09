<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	import * as Form from '$lib/components/ui/form';
	import { languageTag } from '$lib/paraglide/runtime';

	import Textarea from '../ui/textarea/textarea.svelte';

	type Props = {
		charactersLeft: number;
		isHiddenLabel?: boolean;
		label: string;
	};
	let {
		value = $bindable(),
		isHiddenLabel = false,
		charactersLeft,
		label,
		...rest
	}: Props & HTMLTextareaAttributes = $props();

	const scrollToBottom = async (event: KeyboardEvent) => {
		const node = event.target as HTMLTextAreaElement;
		const isCursorAtEnd = node.selectionStart === node.value.length;
		if (isCursorAtEnd) {
			node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
		}
	};

	let formattedCount = $derived(new Intl.NumberFormat(languageTag()).format(charactersLeft || 0));
</script>

<Form.Control let:attrs>
	<Form.Label class={isHiddenLabel ? 'sr-only' : ''}>{label}</Form.Label>
	<div class="relative">
		<Textarea class="resize-none pb-5" {...attrs} bind:value {...rest} on:keyup={scrollToBottom} />
		<span
			class="absolute bottom-[1px] right-[1px] rounded-tl bg-background p-1 text-xs {charactersLeft <
			0
				? 'text-destructive'
				: 'text-muted-foreground'}"
			>{formattedCount}
		</span>
	</div>
</Form.Control>
<Form.FieldErrors />
