<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import Copy from 'lucide-svelte/icons/copy';

	import * as m from '$lib/paraglide/messages.js';
	import { copyText } from '$lib/utils';

	import Button from '../button/button.svelte';

	export let text = '';

	let visible = false;

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

<div {...$$restProps} class="relative inline-flex {$$restProps?.class}">
	<Button data-testid="copy-link" on:click={copy}
		><Copy class="mr-2 h-4 w-4" />{m.knotty_fuzzy_scallop_fall()}</Button
	>
	<div
		role="tooltip"
		class="{visible
			? 'visible opacity-100'
			: 'invisible opacity-0'} bg-primary text-primary-contrast absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-lg px-3 py-2 transition-all ease-in-out"
	>
		<Check />
	</div>
</div>
