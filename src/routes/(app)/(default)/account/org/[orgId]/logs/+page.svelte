<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';

	import * as Avatar from '$lib/components/ui/avatar';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Table from '$lib/components/ui/table';
	import { SecretType } from '$lib/data/enums';
	import { formatDate } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { summary, secretTypes, members } = $derived(data.stats);

	const secretTypeRows = $derived([
		{ label: 'Text', count: secretTypes.textSecrets, type: SecretType.TEXT },
		{ label: 'File', count: secretTypes.fileSecrets, type: SecretType.FILE },
		{ label: 'Redirect', count: secretTypes.redirectSecrets, type: SecretType.REDIRECT },
		{ label: 'Snap', count: secretTypes.snapSecrets, type: SecretType.SNAP },
		{ label: 'Neogram', count: secretTypes.neogramSecrets, type: SecretType.NEOGRAM }
	]);

	const totalSecretTypes = $derived(secretTypeRows.reduce((acc, r) => acc + Number(r.count), 0));

	const siteDesc = $derived(
		secretTypes.domain ? m.flat_warm_logs_secrets_desc({ domain: secretTypes.domain }) : undefined
	);

	const formatShare = (count: number) =>
		totalSecretTypes > 0 ? `${((count / totalSecretTypes) * 100).toFixed(1)}%` : '—';

	const formatRelative = (date: Date | null) => {
		if (!date) return null;
		const diff = Date.now() - new Date(date).getTime();
		const minutes = Math.floor(diff / 60_000);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `${days}d ago`;
		return formatDate(new Date(date));
	};
</script>

<h1 class="mb-2 text-2xl font-bold">{m.flat_warm_logs_title()}</h1>
<p class="mb-6 text-lg leading-normal">
	The stats below are aggregated. Actual secrets are deleted after the retention period defined by
	your plan.
</p>

<!-- Summary -->
<div class="xs:grid-cols-2 mb-6 grid grid-cols-1 gap-4">
	<Card>
		<p class="text-muted-foreground truncate text-sm font-medium">
			{m.flat_warm_logs_total_members()}
		</p>
		<p class="text-3xl font-bold">{summary.totalMembers}</p>
	</Card>
	<Card>
		<p class="text-muted-foreground truncate text-sm font-medium">{m.flat_warm_logs_mau()}</p>
		<p class="text-3xl font-bold">{summary.mau}</p>
	</Card>
	<Card>
		<p class="text-muted-foreground truncate text-sm font-medium">
			{m.flat_warm_logs_total_secrets()}
		</p>
		<p class="text-3xl font-bold">{summary.totalSecrets}</p>
	</Card>
	<Card>
		<p class="text-muted-foreground truncate text-sm font-medium">
			{m.flat_warm_logs_total_secret_requests()}
		</p>
		<p class="text-3xl font-bold">{summary.totalSecretRequests}</p>
	</Card>
</div>

<!-- Secret Links by type -->
<Card title={m.flat_warm_logs_secrets()} description={siteDesc} class="mb-6">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>{m.flat_warm_logs_secret_type()}</Table.Head>
				<Table.Head class="text-right">{m.flat_warm_logs_secret_count()}</Table.Head>
				<Table.Head class="text-right">{m.flat_warm_logs_secret_share()}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each secretTypeRows as row (row.type)}
				<Table.Row>
					<Table.Cell class="font-medium">{row.label}</Table.Cell>
					<Table.Cell class="text-right">{row.count}</Table.Cell>
					<Table.Cell class="text-right text-sm">{formatShare(Number(row.count))}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
		<Table.Footer>
			<Table.Row>
				<Table.Cell class="font-semibold">{m.flat_warm_logs_total()}</Table.Cell>
				<Table.Cell class="text-right font-semibold">{totalSecretTypes}</Table.Cell>
				<Table.Cell class="text-right font-semibold">100%</Table.Cell>
			</Table.Row>
		</Table.Footer>
	</Table.Root>
</Card>

<!-- Members log -->
<Card title={m.flat_warm_logs_members()}>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>{m.cuddly_flat_salmon_express()}</Table.Head>
				<Table.Head>{m.bad_close_anaconda_forgive()}</Table.Head>
				<Table.Head>{m.flat_warm_logs_last_active()}</Table.Head>
				<Table.Head class="text-center">{m.flat_warm_logs_email_verified()}</Table.Head>
				<Table.Head class="text-right">{m.flat_warm_logs_total_secrets()}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each members as member (member.userId)}
				<Table.Row>
					<Table.Cell>
						<div class="flex items-center gap-2">
							<Avatar.Root class="h-7 w-7">
								<Avatar.Image src={member.picture} alt={member.name ?? member.email} />
								<Avatar.Fallback
									class="border-foreground bg-foreground text-background border text-xs uppercase"
								>
									{Array.from(member.email)[0]}
								</Avatar.Fallback>
							</Avatar.Root>
							<div>
								{#if member.name}
									<div class="text-sm leading-tight font-medium">{member.name}</div>
								{/if}
								<div class="text-muted-foreground text-xs">{member.email}</div>
							</div>
						</div>
					</Table.Cell>
					<Table.Cell class="text-sm">{member.role}</Table.Cell>
					<Table.Cell class="text-sm">
						{#if member.lastLoginAt}
							<span title={formatDate(new Date(member.lastLoginAt))}>
								{formatRelative(member.lastLoginAt)}
							</span>
						{:else}
							<span class="text-muted-foreground">{m.flat_warm_logs_never()}</span>
						{/if}
					</Table.Cell>
					<Table.Cell class="text-center">
						{#if member.emailVerified}
							<Check class="text-primary mx-auto h-4 w-4" />
						{:else}
							<X class="text-muted-foreground mx-auto h-4 w-4" />
						{/if}
					</Table.Cell>
					<Table.Cell class="text-right font-medium">{member.totalSecrets}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Card>
