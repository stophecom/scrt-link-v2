<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import { PersistedState } from 'runed';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as m from '$lib/paraglide/messages.js';

	const colors = [
		'#E60077',
		'#8645b5',
		'#2071c9',
		'#068484',
		'#1E8552',
		'#EA0B0B',
		'#804A00',
		'#3A54A1'
	];

	const activeColor = new PersistedState('activeColor', colors[0]);

	$effect(() => {
		const documentStyle = document.documentElement.style;
		documentStyle.setProperty('--color-primary', activeColor.current);
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]}
			><div
				class="h-4 w-4 rounded-full"
				style="background-color: {activeColor.current};"
			></div></Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Label>{m.day_direct_monkey_clasp()}</DropdownMenu.Label>
		<DropdownMenu.Separator />

		<div class="grid grid-cols-4 gap-3 p-4">
			{#each colors as color}
				<button
					class="flex h-10 w-10 items-center justify-center"
					style="background-color: {color};"
					aria-label={color}
					onclick={() => {
						activeColor.current = color;
					}}
				>
					{#if activeColor.current === color}
						<Check class="h-5 w-5 text-white" />
					{/if}
				</button>
			{/each}
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>
