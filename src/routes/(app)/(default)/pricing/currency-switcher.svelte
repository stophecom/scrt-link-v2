<script lang="ts">
	import Globe from '@lucide/svelte/icons/globe';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { SupportedCurrency } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';

	type Props = {
		activeCurrency: SupportedCurrency;
	};

	let { activeCurrency = $bindable() }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" class="uppercase">
				<Globe class="mr-2 h-4 w-4" />
				{activeCurrency}
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.Label>{m.gross_smart_toucan_borrow()}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup
				value={activeCurrency as string}
				onValueChange={async (value) => {
					activeCurrency = value as SupportedCurrency;
				}}
			>
				{#each Object.values(SupportedCurrency) as currency (currency)}
					<DropdownMenu.RadioItem value={currency} class="uppercase"
						>{currency}</DropdownMenu.RadioItem
					>
				{/each}
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
