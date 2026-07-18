<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';

	import Markdown from '$lib/components/ui/markdown/markdown.svelte';
	import * as Table from '$lib/components/ui/table';
	import { appName } from '$lib/data/app';
	import type { FeatureRow } from '$lib/data/comparisons';

	type Props = { competitorName: string; rows: FeatureRow[] };
	let { competitorName, rows }: Props = $props();
</script>

<div class="overflow-x-auto pt-2">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[220px]">Feature</Table.Head>
				<Table.Head class="text-primary text-center font-semibold">{appName}</Table.Head>
				<Table.Head class="text-center font-semibold">{competitorName}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each rows as row (row.label)}
				<Table.Row>
					<Table.Cell class="font-medium">
						<Markdown markdown={row.label} />
					</Table.Cell>
					{#each [row.scrtLink, row.competitor] as value, i (i)}
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
