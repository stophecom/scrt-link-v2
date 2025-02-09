<script lang="ts">
	import Globe from 'lucide-svelte/icons/globe';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { getSupportedLanguagesMap } from '$lib/data/supportedLocales';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { availableLanguageTags } from '$lib/paraglide/runtime';
	import { languageTag } from '$lib/paraglide/runtime';

	const switchToLanguage = (newLanguage: AvailableLanguageTag) => {
		const canonicalPath = i18n.route(page.url.pathname);
		const localizedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localizedPath);
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]}
			><Globe class="mr-2 h-4 w-4" /> {getSupportedLanguagesMap(languageTag())}</Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label>{m.wacky_bad_swallow_hack()}</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.RadioGroup
			value={languageTag()}
			onValueChange={(value) => {
				switchToLanguage(value as AvailableLanguageTag);
			}}
		>
			{#each availableLanguageTags as tag}
				<DropdownMenu.RadioItem value={tag}>{getSupportedLanguagesMap(tag)}</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
