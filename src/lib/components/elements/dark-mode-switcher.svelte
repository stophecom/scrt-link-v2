<script lang="ts">
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import { toggleMode } from 'mode-watcher';

	import { cn } from '$lib/client/utils';
	import { Button, type ButtonProps } from '$lib/components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		hideLabel?: boolean;
	};

	let { hideLabel, ...rest }: Props & ButtonProps = $props();
</script>

<Button onclick={toggleMode} class={cn('relative', rest.class)} {...rest}>
	<Sun class="h-[1.2rem] w-[1.2rem] opacity-100 transition-all dark:opacity-0" />
	<Moon class="absolute left-4 h-[1.2rem] w-[1.2rem] opacity-0 transition-all dark:opacity-100 " />

	<span class={hideLabel ? 'sr-only' : 'ms-2'}>{m.hour_lofty_warthog_wish()}</span>
</Button>
