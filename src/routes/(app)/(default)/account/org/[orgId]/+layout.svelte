<script lang="ts">
	import Activity from '@lucide/svelte/icons/activity';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Globe from '@lucide/svelte/icons/globe';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import Users from '@lucide/svelte/icons/users';
	import type { Snippet } from 'svelte';

	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { children }: { children: Snippet } = $props();

	const orgId = $derived(page.params.orgId);
	const isAdmin = $derived(page.data.isOrgOwner || page.data.isOrgAdmin);
	const isOrgOwner = $derived(page.data.isOrgOwner);
	const currentPath = $derived(page.url.pathname);

	const subNavItems = $derived([
		{
			href: localizeHref(`/account/org/${orgId}`),
			label: m.proof_north_walrus_ask(),
			icon: Users,
			exact: true
		},
		...(isAdmin
			? [
					{
						href: localizeHref(`/account/org/${orgId}/white-label`),
						label: m.bold_slim_ram_roam(),
						icon: Globe,
						exact: false
					},
					{
						href: localizeHref(`/account/org/${orgId}/api`),
						label: m.super_funny_jackal_pause(),
						icon: KeyRound,
						exact: false
					}
				]
			: []),
		...(isOrgOwner
			? [
					{
						href: localizeHref(`/account/org/${orgId}/billing`),
						label: m.misty_teal_hawk_glow(),
						icon: CreditCard,
						exact: false
					},
					{
						href: localizeHref(`/account/org/${orgId}/logs`),
						label: m.flat_warm_logs_tab(),
						icon: Activity,
						exact: false
					}
				]
			: [])
	]);

	const isActive = (href: string, exact: boolean) =>
		exact ? currentPath === href : currentPath.startsWith(href);
</script>

<!-- Scrolls horizontally rather than widening the page: the tabs don't all fit on a phone. -->
<div class="mb-4 flex gap-1 overflow-x-auto">
	{#each subNavItems as item (item.href)}
		<a
			href={item.href}
			class="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors
				{isActive(item.href, item.exact)
				? 'bg-muted font-medium'
				: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
		>
			<item.icon class="h-3.5 w-3.5" />
			{item.label}
		</a>
	{/each}
</div>

{@render children()}
