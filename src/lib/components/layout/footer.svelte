<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { uptimerobotUrl } from '$lib/data/app';
	import { imprintMenu } from '$lib/data/menu';
	import * as m from '$lib/paraglide/messages.js';
	import { languageTag } from '$lib/paraglide/runtime';

	import type { LayoutData } from '../../../routes/$types';
	import LanguageSwitcher from '../ui/language-switcher/language-switcher.svelte';

	let { totalSecrets }: Pick<LayoutData, 'totalSecrets'> = $props();
	let secretsCount = $derived(new Intl.NumberFormat(languageTag()).format(totalSecrets || 0));
</script>

<footer class="border-border bg-background border-t pt-14 shadow-[0_0_60px_0_rgba(0,0,0,0.08)]">
	<div class="container flex flex-col items-center justify-center">
		<div class="p-5 text-center text-sm font-bold">
			{m.equal_tiny_wren_skip({
				number: secretsCount
			})}
		</div>
		<div class="text-muted-contrast max-w-(--breakpoint-sm) p-5 text-center text-sm">
			{m.candid_red_lynx_offer()}
		</div>

		<Separator />

		<div class="text-muted-contrast flex flex-wrap items-center text-sm">
			<span class="p-2 pe-4">©{new Date().getFullYear()} SANTiHANS GmbH</span>
			{#each imprintMenu() as menuItem}
				<a class="p-2 underline" href={menuItem.href}>
					{menuItem.label}
				</a>
			{/each}
			<span>
				<a class="py-2 ps-2 pe-0 underline" target="_blank" href={uptimerobotUrl}>Status</a>
				<span class="text-success ps-1 text-xs">●</span>
			</span>
		</div>

		<div class="py-5">
			<LanguageSwitcher />
		</div>
	</div>
</footer>
