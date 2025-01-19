<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import Copy from 'lucide-svelte/icons/copy';

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
	<Button data-testid="copy-link" size="lg" class="uppercase" on:click={copy}
		><Copy class="mr-2 h-[1.2rem] w-[1.2rem]" />Copy</Button
	>
	<div
		role="tooltip"
		class="{visible
			? 'opacity-1 visible'
			: 'invisible opacity-0'} absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-white transition-all ease-in-out"
	>
		<Check />
	</div>
</div>
