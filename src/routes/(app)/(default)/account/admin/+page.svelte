<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
	const formatDate = (date: Date) =>
		new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));
</script>

<!-- KPI Cards -->
<div>
	<Button variant="outline" class="mb-6" href={localizeHref('/account/admin/email-previews')}
		>Email Previews</Button
	>
</div>
<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
	<Card>
		<p class="text-muted-foreground truncate text-sm font-medium">Total Users</p>
		<p class="text-3xl font-bold">{data.totalUsers}</p>
	</Card>
	<Card>
		<p class="text-muted-foreground truncate text-sm font-medium">Paid Subscriptions</p>
		<p class="text-3xl font-bold">{data.activeSubscriptions}</p>
	</Card>
	<Card>
		<p class="text-muted-foreground truncate text-sm font-medium">Total Secrets</p>
		<p class="text-3xl font-bold">{data.globalStats?.totalSecrets ?? 0}</p>
	</Card>
	<Card>
		<p class="text-muted-foreground truncate text-sm font-medium">Organizations</p>
		<p class="text-3xl font-bold">{data.totalOrganizations}</p>
	</Card>
</div>

<!-- Users Section -->
<Card title="Users" class="mb-6">
	<div class="mb-4 flex flex-wrap gap-6 text-sm">
		<div>
			<span class="text-muted-foreground">Encryption adoption:</span>
			<span class="font-medium">{formatPercent(data.adoptionRates.encryptionRate)}</span>
		</div>
		<div>
			<span class="text-muted-foreground">Email verified:</span>
			<span class="font-medium">{formatPercent(data.adoptionRates.emailVerificationRate)}</span>
		</div>
	</div>

	<h3 class="mb-2 text-lg font-semibold">Subscription Tiers</h3>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Tier</Table.Head>
				<Table.Head class="text-right">Users</Table.Head>
				<Table.Head class="text-right">%</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.usersByTier as tier, i (i)}
				<Table.Row>
					<Table.Cell>{tier.tier}</Table.Cell>
					<Table.Cell class="text-right">{tier.count}</Table.Cell>
					<Table.Cell class="text-right">{formatPercent(tier.count / data.totalUsers)}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<Separator class="my-6" />

	<h3 class="mb-2 text-lg font-semibold">User Signups by Month</h3>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Month</Table.Head>
				<Table.Head class="text-right">Signups</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.userSignups as month, i (i)}
				<Table.Row>
					<Table.Cell>{month.month}</Table.Cell>
					<Table.Cell class="text-right">{month.count}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<Separator class="my-6" />

	<h3 class="mb-2 text-lg font-semibold">Recent Signups</h3>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Email</Table.Head>
				<Table.Head>Name</Table.Head>
				<Table.Head>Tier</Table.Head>
				<Table.Head class="text-right">Date</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.recentSignups as signup, i (i)}
				<Table.Row>
					<Table.Cell class="max-w-[200px] truncate">{signup.email}</Table.Cell>
					<Table.Cell>{signup.name ?? '—'}</Table.Cell>
					<Table.Cell>{signup.tier}</Table.Cell>
					<Table.Cell class="text-right">{formatDate(signup.createdAt)}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Card>

<!-- Secrets Section -->
<Card title="Secrets" class="mb-6">
	<h3 class="mb-2 text-lg font-semibold">Secret Links</h3>
	<div class="mb-4 flex flex-wrap gap-6 text-sm">
		<div>
			<span class="text-muted-foreground">Currently pending:</span>
			<span class="font-medium">{data.secretCounts.pending}</span>
		</div>
		<div>
			<span class="text-muted-foreground">Retrieved:</span>
			<span class="font-medium">{data.secretCounts.retrieved}</span>
		</div>
		<div>
			<span class="text-muted-foreground">Password-protected:</span>
			<span class="font-medium">{data.secretCounts.withPassword}</span>
		</div>
	</div>

	{#if data.globalStats}
		{@const totalByType =
			(data.globalStats.textSecrets ?? 0) +
			(data.globalStats.fileSecrets ?? 0) +
			(data.globalStats.redirectSecrets ?? 0) +
			(data.globalStats.snapSecrets ?? 0) +
			(data.globalStats.neogramSecrets ?? 0)}
		{#if totalByType > 0}
			<h3 class="mb-2 text-lg font-semibold">Secret Type Distribution</h3>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Type</Table.Head>
						<Table.Head class="text-right">Count</Table.Head>
						<Table.Head class="text-right">%</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each [{ name: 'Text', count: data.globalStats.textSecrets ?? 0 }, { name: 'File', count: data.globalStats.fileSecrets ?? 0 }, { name: 'Redirect', count: data.globalStats.redirectSecrets ?? 0 }, { name: 'Snap', count: data.globalStats.snapSecrets ?? 0 }, { name: 'Neogram', count: data.globalStats.neogramSecrets ?? 0 }].filter((t) => t.count > 0) as type, i (i)}
						<Table.Row>
							<Table.Cell>{type.name}</Table.Cell>
							<Table.Cell class="text-right">{type.count}</Table.Cell>
							<Table.Cell class="text-right">{formatPercent(type.count / totalByType)}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			<Separator class="my-6" />
		{/if}
	{/if}

	<h3 class="mb-2 text-lg font-semibold">Secret Requests</h3>
	<div class="flex flex-wrap gap-6 text-sm">
		<div>
			<span class="text-muted-foreground">Total:</span>
			<span class="font-medium">{data.secretRequestStats.total}</span>
		</div>
		<div>
			<span class="text-muted-foreground">Responded:</span>
			<span class="font-medium">{data.secretRequestStats.responded}</span>
		</div>
		<div>
			<span class="text-muted-foreground">Pending:</span>
			<span class="font-medium">{data.secretRequestStats.pending}</span>
		</div>
		<div>
			<span class="text-muted-foreground">Expired:</span>
			<span class="font-medium">{data.secretRequestStats.expired}</span>
		</div>
		{#if data.secretRequestStats.total > 0}
			<div>
				<span class="text-muted-foreground">Response rate:</span>
				<span class="font-medium"
					>{formatPercent(data.secretRequestStats.responded / data.secretRequestStats.total)}</span
				>
			</div>
		{/if}
	</div>

	<Separator class="my-6" />

	<h3 class="mb-2 text-lg font-semibold">Top Users by Secrets</h3>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Email</Table.Head>
				<Table.Head>Tier</Table.Head>
				<Table.Head class="text-right">Secrets</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.topUsers as item, i (i)}
				<Table.Row>
					<Table.Cell class="max-w-[200px] truncate">{item.email}</Table.Cell>
					<Table.Cell>{item.tier}</Table.Cell>
					<Table.Cell class="text-right">{item.totalSecrets}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Card>

<!-- Organizations Section -->
<Card title="Organizations" class="mb-6">
	{#if data.organizationSizes.length === 0}
		<p class="text-muted-foreground">No organizations yet.</p>
	{:else}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head class="text-right">Members</Table.Head>
					<Table.Head class="text-right">Secrets</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.organizationSizes as org, i (i)}
					<Table.Row>
						<Table.Cell>{org.name}</Table.Cell>
						<Table.Cell class="text-right">{org.memberCount}</Table.Cell>
						<Table.Cell class="text-right">{org.totalSecrets}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</Card>

<!-- API Section -->
<Card title="API" class="mb-6">
	<div class="flex flex-wrap gap-6 text-sm">
		<div>
			<span class="text-muted-foreground">API keys (total):</span>
			<span class="font-medium">{data.apiKeyStats.total}</span>
		</div>
		<div>
			<span class="text-muted-foreground">Active:</span>
			<span class="font-medium">{data.apiKeyStats.active}</span>
		</div>
		<div>
			<span class="text-muted-foreground">Users with keys:</span>
			<span class="font-medium">{data.apiKeyStats.usersWithKeys}</span>
		</div>
	</div>
</Card>

<!-- White Label Section -->
<Card title="White Label" class="mb-6">
	<div class="flex flex-wrap gap-6 text-sm">
		<div>
			<span class="text-muted-foreground">White-label sites:</span>
			<span class="font-medium">{data.whiteLabelStats.total}</span>
		</div>
		<div>
			<span class="text-muted-foreground">Published:</span>
			<span class="font-medium">{data.whiteLabelStats.published}</span>
		</div>
	</div>
</Card>
