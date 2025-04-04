<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page title="Admin" lead="Insights and Playground">
	<Card title="Top Users" description="Users with the most created secrets">
		{#each data.userStats as item}
			<div>
				{item.user?.email}:
				{item.stats.totalSecrets}
			</div>
		{/each}
	</Card>
</Page>
