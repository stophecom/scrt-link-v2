<script lang="ts">
	import Globe from 'lucide-svelte/icons/globe';
	import { onMount } from 'svelte';

	import { afterNavigate, goto } from '$app/navigation';
	import { supportedCurrencies } from '$lib/client/constants';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { m } from '$lib/paraglide/messages.js';

	let activeCurrency = $state('usd');

	const setCurrencyFromUrl = () => {
		let params = new URLSearchParams(document.location.search);
		let currencyFromUrl = params.get('currency');

		if (currencyFromUrl && supportedCurrencies.includes(currencyFromUrl)) {
			activeCurrency = currencyFromUrl;
		}
	};

	onMount(() => {
		setCurrencyFromUrl();
	});

	afterNavigate(() => {
		setCurrencyFromUrl();
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="uppercase"
			><Globe class="mr-2 h-4 w-4" /> {activeCurrency}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label>{m.gross_smart_toucan_borrow()}</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.RadioGroup
			value={activeCurrency}
			onValueChange={async (value) => {
				await goto(`?currency=${value}`);
			}}
		>
			{#each supportedCurrencies as currency}
				<DropdownMenu.RadioItem value={currency} class="uppercase"
					>{currency}</DropdownMenu.RadioItem
				>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
