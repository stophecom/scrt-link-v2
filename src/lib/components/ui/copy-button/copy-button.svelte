<script lang="ts">
	import Check from 'lucide-svelte/icons/check';

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
	<Button data-testid="copy-link" class="uppercase" on:click={copy}>Copy</Button>
	<div
		role="tooltip"
		class="{visible
			? 'opacity-1 visible'
			: 'invisible opacity-0'} tooltip absolute bottom-1/2 left-1/2 z-10 inline-block -translate-x-1/2 translate-y-1/2 rounded-lg bg-primary px-3 py-2 text-base font-medium uppercase text-white transition-all ease-in-out"
	>
		<Check class="h-4 w-4" />
	</div>
</div>
