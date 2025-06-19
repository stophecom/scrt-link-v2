<script lang="ts">
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import { toggleMode } from 'mode-watcher';

	import { cn } from '$lib/client/utils';
	import { Button, type ButtonProps } from '$lib/components/ui/button/index.js';
	import { m } from '$lib/paraglide/messages.js';

	type Props = {
		hideLabel?: boolean;
	};

	let { hideLabel, ...rest }: Props & ButtonProps = $props();
</script>

<Button onclick={toggleMode} class={cn('relative', rest.class)} {...rest}>
	<Moon class="hidden h-5 w-5 dark:block " />
	<Sun class="block h-5 w-5 dark:hidden" />

	<span class={hideLabel ? 'sr-only' : 'ms-2'}>{m.hour_lofty_warthog_wish()}</span>
</Button>
