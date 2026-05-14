<script lang="ts">
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Globe from '@lucide/svelte/icons/globe';
	import Users from '@lucide/svelte/icons/users';
	import type { Snippet } from 'svelte';

	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { children }: { children: Snippet } = $props();

	const orgId = $derived(page.params.orgId);
	const isOwner = $derived(page.data.isOrgOwner);
	const currentPath = $derived(page.url.pathname);

	const subNavItems = $derived([
		{
			href: localizeHref(`/account/org/${orgId}`),
			label: m.cuddly_flat_salmon_express(),
			icon: Users,
			exact: true
		},
		...(isOwner
			? [
					{
						href: localizeHref(`/account/org/${orgId}/white-label`),
						label: m.bold_slim_ram_roam(),
						icon: Globe,
						exact: false
					},
					{
						href: localizeHref(`/account/org/${orgId}/billing`),
						label: m.misty_teal_hawk_glow(),
						icon: CreditCard,
						exact: false
					}
				]
			: [])
	]);

	const isActive = (href: string, exact: boolean) =>
		exact ? currentPath === href : currentPath.startsWith(href);
</script>

<div class="mb-6 flex gap-1 border-b pb-1">
	{#each subNavItems as item (item.href)}
		<a
			href={item.href}
			class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors
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
