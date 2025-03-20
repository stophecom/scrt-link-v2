<script lang="ts">
	import Globe from 'lucide-svelte/icons/globe';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, type Locale, locales, setLocale } from '$lib/paraglide/runtime';

	import { getSupportedLanguagesMap } from '../../../data/supportedLocales';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]}
			><Globe class="mr-2 h-4 w-4" /> {getSupportedLanguagesMap(getLocale())}</Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label>{m.wacky_bad_swallow_hack()}</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.RadioGroup
			value={getLocale()}
			onValueChange={(value) => {
				setLocale(value as Locale);
			}}
		>
			{#each locales as tag}
				<DropdownMenu.RadioItem value={tag}>{getSupportedLanguagesMap(tag)}</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
