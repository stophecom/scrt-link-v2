<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea';
	import { languageTag } from '$lib/paraglide/runtime';

	type Props = {
		charactersLeft?: number;
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
		{#if typeof charactersLeft === 'number'}
			<span
				class="bg-background absolute right-[1px] bottom-[1px] rounded-xl p-1 text-xs {charactersLeft <=
				0
					? 'text-destructive'
					: 'text-muted-foreground'}"
				>{formattedCount}
			</span>
		{/if}
	</div>
</Form.Control>
<Form.FieldErrors />
