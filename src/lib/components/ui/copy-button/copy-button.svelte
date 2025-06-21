<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';

	import { copyText } from '$lib/client/utils';
	import { m } from '$lib/paraglide/messages.js';

	import type { ButtonProps } from '../button';
	import Button from '../button/button.svelte';

	type Props = {
		text: string;
	};
	let { text, ...rest }: Props & Partial<ButtonProps> = $props();

	let visible = $state(false);

	const copy = (e: MouseEvent) => {
		copyText(text);

		visible = true;
		setTimeout(() => {
			if (e.target instanceof HTMLButtonElement) {
				e.target.blur();
			}
			visible = false; // Ensure this is reactive if you're using Svelte
		}, 700);
	};
</script>

<div class="relative inline-flex {rest?.class}">
	<Button data-testid="copy-link" on:click={copy} {...rest}
		><Copy class="mr-2 h-4 w-4" />{m.knotty_fuzzy_scallop_fall()}</Button
	>
	<div
		role="tooltip"
		class="{visible
			? 'visible opacity-100'
			: 'invisible opacity-0'} bg-primary text-primary-foreground absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-lg px-3 py-2 transition-all ease-in-out"
	>
		<Check />
	</div>
</div>
