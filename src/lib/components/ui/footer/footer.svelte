<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';

	import Separator from '../separator/separator.svelte';

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

<footer>
	<div class="container flex flex-col items-center justify-center">
		<Separator />
		<div class="p-5 text-center">
			{m.equal_tiny_wren_skip({ number: numberOfSecrets })}
		</div>
		<div class="max-w-screen-sm p-5 text-center text-sm">
			{m.candid_red_lynx_offer()}
		</div>
		<div>
			{#each availableLanguageTags as tag}
				<button
					class={cn('p-5 uppercase hover:text-primary', languageTag() === tag && 'text-primary')}
					onclick={() => switchToLanguage(tag)}
				>
					{tag}
				</button>
			{/each}
		</div>
	</div>
</footer>
