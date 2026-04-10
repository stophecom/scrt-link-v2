<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';

	import * as Table from '$lib/components/ui/table';
	import { plans } from '$lib/data/plans';
	import { GB, MB } from '$lib/data/units';
	import { formatBytes } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';

	const allPlans = plans();

	type FeatureRow = {
		label: string;
		values: (boolean | string)[];
	};

	const rows: FeatureRow[] = [
		{
			label: m.bold_fast_bee_hum(),
			values: [
				m.slim_fast_jay_soar(),
				m.bold_keen_elk_rest(),
				m.bold_keen_elk_rest(),
				m.bold_keen_elk_rest()
			]
		},
		{
			label: m.slim_dark_ant_work(),
			values: [
				formatBytes(10 * MB),
				formatBytes(1 * GB),
				formatBytes(100 * GB),
				formatBytes(100 * GB)
			]
		},
		{
			label: m.mild_cool_jay_fly(),
			values: [true, true, true, true]
		},
		{
			label: m.soft_warm_ape_jump(),
			values: [false, true, true, true]
		},
		{
			label: m.keen_fast_ram_look(),
			values: [false, true, true, true]
		},
		{
			label: m.bold_warm_elk_dash(),
			values: [false, true, true, true]
		},
		{
			label: m.slim_cool_fox_rest(),
			values: [false, true, true, true]
		},
		{
			label: m.warm_dark_owl_gaze(),
			values: ['24 hours', '7 days', '30 days', '30 days']
		},
		{
			label: m.cool_keen_cat_leap(),
			values: [false, false, true, true]
		},
		{
			label: m.bold_slim_ram_roam(),
			values: [false, false, false, true]
		},
		{
			label: m.bright_calm_seal_rest(),
			values: [false, false, false, true]
		},
		{
			label: m.swift_bold_hawk_soar(),
			values: [false, false, false, true]
		},
		{
			label: m.keen_warm_eel_swim(),
			values: [
				'-',
				m.tired_new_mantis_buy(),
				m.still_busy_starfish_dare(),
				m.still_busy_starfish_dare()
			]
		}
	];
</script>

<div class="overflow-x-auto pt-2">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[200px]">{m.warm_keen_crow_rest()}</Table.Head>
				{#each allPlans as plan (plan.name)}
					<Table.Head class="text-center font-semibold">{plan.name}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each rows as row (row.label)}
				<Table.Row>
					<Table.Cell class="font-medium">{row.label}</Table.Cell>

					{#each row.values as value, i (i)}
						<Table.Cell class="text-center">
							{#if typeof value === 'boolean'}
								{#if value}
									<Check class="text-primary mx-auto h-4 w-4" />
								{:else}
									<X class="text-muted-foreground mx-auto h-4 w-4" />
								{/if}
							{:else}
								<span class="text-sm">{value}</span>
							{/if}
						</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
