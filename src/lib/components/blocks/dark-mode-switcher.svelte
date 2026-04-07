<script lang="ts">
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { Switch as SwitchPrimitive } from 'bits-ui';
	import { mode, setMode } from 'mode-watcher';

	import { m } from '$lib/paraglide/messages.js';

	let checked = $derived(mode.current === 'dark');

	function handleCheckedChange(value: boolean) {
		setMode(value ? 'dark' : 'light');
	}
</script>

<SwitchPrimitive.Root
	{checked}
	onCheckedChange={handleCheckedChange}
	aria-label={m.hour_lofty_warthog_wish()}
	class="data-[state=checked]:bg-input bg-input relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
>
	<SwitchPrimitive.Thumb
		class="bg-background pointer-events-none flex h-6 w-6 items-center justify-center rounded-full shadow-lg ring-0 transition-all duration-300 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
	></SwitchPrimitive.Thumb>
	<Sun
		class="absolute left-1 h-4 w-4 origin-center scale-80 transition-all duration-300 dark:scale-60"
	/>
	<Moon
		class="absolute right-1 h-4 w-4 origin-center scale-60 transition-all duration-300 ease-in-out dark:scale-80"
	/>
</SwitchPrimitive.Root>
