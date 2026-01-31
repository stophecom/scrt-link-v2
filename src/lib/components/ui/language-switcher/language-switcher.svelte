<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import Globe from '@lucide/svelte/icons/globe';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, type Locale, locales, setLocale } from '$lib/paraglide/runtime';

	import { getSupportedLanguagesMap } from '../../../data/supportedLocales';

	type Props = { showDropdownIndicator?: boolean };

	let { showDropdownIndicator = false }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline">
				<Globe class="mr-2 h-4 w-4" />
				{getSupportedLanguagesMap(getLocale())}
				{#if showDropdownIndicator}
					<ChevronDown class="ms-2 h-4 w-4" />
				{/if}
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.Label>{m.wacky_bad_swallow_hack()}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup
				value={getLocale()}
				onValueChange={(value) => {
					setLocale(value as Locale);
				}}
			>
				{#each locales as tag, i (i)}
					<DropdownMenu.RadioItem value={tag}
						>{getSupportedLanguagesMap(tag)}</DropdownMenu.RadioItem
					>
				{/each}
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
