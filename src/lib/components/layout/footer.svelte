<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { uptimerobotUrl } from '$lib/data/constants';
	import { imprintMenu } from '$lib/data/menu';
	import { getSupportedLanguagesMap } from '$lib/data/supportedLocales';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localizedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localizedPath);
	}

	import { availableLanguageTags } from '$lib/paraglide/runtime';
	import { languageTag } from '$lib/paraglide/runtime';
	import { cn } from '$lib/utils';

	let numberOfSecrets = 124; // Make dynamic
</script>

<footer class="border-t bg-background pt-14 shadow-[0_0_60px_0_rgba(0,0,0,0.08)]">
	<div class="container flex flex-col items-center justify-center">
		<div class="p-5 text-center text-sm font-bold">
			{m.equal_tiny_wren_skip({ number: numberOfSecrets })}
		</div>
		<div class="max-w-screen-sm p-5 text-center text-sm text-muted-foreground">
			{m.candid_red_lynx_offer()}
		</div>

		<Separator />

		<div class="flex items-center text-sm text-muted-foreground">
			<span class="p-3">©{new Date().getFullYear()} SANTiHANS GmbH</span>
			{#each imprintMenu() as menuItem}
				<a class="p-3 underline" href={menuItem.href}>
					{menuItem.label}
				</a>
			{/each}
			<span>
				<a class="p-3 pe-0 underline" target="_blank" href={uptimerobotUrl}>Status</a>
				<span class="ps-1 text-xs text-success">●</span>
			</span>
		</div>

		<div class="py-5 text-sm text-primary">
			{#each availableLanguageTags as tag}
				<button
					class={cn(
						'mx-5 inline-flex border-b border-b-primary/50 leading-none hover:border-b-primary',
						languageTag() === tag && 'border-b-transparent'
					)}
					onclick={() => switchToLanguage(tag)}
				>
					{getSupportedLanguagesMap(tag)}
				</button>
			{/each}
		</div>
	</div>
</footer>
