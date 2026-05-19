<script lang="ts">
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import type { HTMLInputAttributes } from 'svelte/elements';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { m } from '$lib/paraglide/messages.js';

	type Props = {
		isHiddenLabel?: boolean;
	};
	let {
		value = $bindable(),
		isHiddenLabel = false,
		...rest
	}: Props & HTMLInputAttributes = $props();

	let isVisible = $state(false);
	let inputEl = $state<HTMLInputElement>();

	$effect(() => {
		if (inputEl) {
			inputEl.type = isVisible ? 'text' : 'password';
		}
	});

	const toggle = () => {
		isVisible = !isVisible;
		inputEl?.focus();
	};
</script>

<Form.Control let:attrs>
	<Form.Label class={isHiddenLabel ? 'sr-only' : ''}>{m.yummy_fair_gazelle_link()}</Form.Label>
	<div class="relative">
		<Input
			type="password"
			class="pr-12"
			placeholder={m.yummy_fair_gazelle_link()}
			{...attrs}
			bind:value
			bind:el={inputEl}
			{...rest}
		/>
		<Button
			variant="ghost"
			size="icon"
			class="absolute top-0 right-0"
			tabindex={-1}
			aria-pressed={isVisible}
			aria-label={isVisible ? m.swift_calm_owl_conceal() : m.swift_calm_owl_reveal()}
			onclick={toggle}
		>
			{#if isVisible}
				<EyeOff class="h-4 w-4" />
			{:else}
				<Eye class="h-4 w-4" />
			{/if}
		</Button>
	</div>
</Form.Control>
<Form.FieldErrors />
