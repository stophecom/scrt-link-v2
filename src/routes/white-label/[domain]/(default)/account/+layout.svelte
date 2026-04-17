<script lang="ts">
	import ConciergeBell from '@lucide/svelte/icons/concierge-bell';
	import Lock from '@lucide/svelte/icons/lock';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Menu from '@lucide/svelte/icons/menu';
	import SettingsGroup from '@lucide/svelte/icons/settings';
	import type { Snippet } from 'svelte';

	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { clearMasterKey, isKeyUnlocked, tryRestoreKey } from '$lib/client/key-manager';
	import PageWrapper from '$lib/components/blocks/page-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Spinner } from '$lib/components/ui/spinner';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { children }: { children: Snippet } = $props();

	// Encryption gate for routes that require it
	let keyRestoreAttempted = $state(false);
	let encryptionEnabled = $derived(!!page.data.user?.encryptionEnabled);
	let encryptionUnlocked = $derived(keyRestoreAttempted && isKeyUnlocked());

	const encryptionRequiredPaths = ['/account/requests'];
	let routeRequiresEncryption = $derived(
		encryptionRequiredPaths.some((p) => page.url.pathname.includes(p))
	);
	let showEncryptionGate = $derived(
		routeRequiresEncryption && encryptionEnabled && !encryptionUnlocked
	);
	let showEncryptionSetup = $derived(routeRequiresEncryption && !encryptionEnabled);

	$effect(() => {
		if (browser) {
			const userId = page.data.user?.id;
			if (!userId) {
				clearMasterKey();
				keyRestoreAttempted = true;
				return;
			}
			tryRestoreKey(userId).then(() => {
				keyRestoreAttempted = true;
			});
		}
	});

	const handleLogout = () => {
		return async ({ update }: { update: () => Promise<void> }) => {
			clearMasterKey();
			await update();
		};
	};

	// Navigation items
	let enableSecretRequests = $derived(page.data.enableSecretRequests);
	const navItems = $derived([
		{
			href: localizeHref('/account/secrets'),
			label: m.free_nimble_whale_fry(),
			icon: Lock
		},
		...(enableSecretRequests
			? [
					{
						href: localizeHref('/account/requests'),
						label: m.calm_proud_ibis_list(),
						icon: ConciergeBell
					}
				]
			: []),
		{
			href: localizeHref('/account/settings'),
			label: m.nimble_quick_bird_sew(),
			icon: SettingsGroup
		}
	]);

	let currentPath = $derived(page.url.pathname);
	let currentItem = $derived(
		navItems.find((item) => currentPath.startsWith(item.href)) || navItems[0]
	);
</script>

<PageWrapper metaTitle={currentItem.label}>
	<Container variant="wide">
		<div class="flex flex-col space-y-8 pb-12 lg:flex-row lg:space-y-0 lg:space-x-12">
			<!-- Mobile Navigation (Dropdown) -->
			<div class="mb-4 block lg:hidden">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="w-full justify-between">
								<span class="flex items-center">
									{#if currentItem}
										<svelte:component this={currentItem.icon} class="mr-2 h-4 w-4" />
										{currentItem.label}
									{/if}
								</span>
								<Menu class="h-4 w-4 opacity-50" />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-[var(--bits-dropdown-menu-anchor-width)]">
						<DropdownMenu.Group>
							{#each navItems as item (item.href)}
								<DropdownMenu.Item class={currentPath === item.href ? 'bg-muted font-medium' : ''}>
									<a href={item.href} class="flex w-full items-center">
										<svelte:component this={item.icon} class="mr-2 h-4 w-4" />
										<span>{item.label}</span>
									</a>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<form
								class="w-full"
								method="post"
								action="/account?/logout"
								use:enhance={handleLogout}
							>
								<button type="submit" class="flex w-full items-center text-left">
									<LogOut class="mr-2 h-4 w-4" />
									<span>{m.wacky_big_raven_honor()}</span>
								</button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			<!-- Desktop Navigation (Sidebar) -->
			<aside class="hidden lg:block lg:w-1/4">
				<nav class="flex flex-col space-y-1">
					{#each navItems as item (item.href)}
						<Button
							href={item.href}
							variant={currentPath === item.href ? 'secondary' : 'ghost'}
							class="justify-start {currentPath === item.href
								? 'bg-muted hover:bg-muted'
								: 'hover:bg-transparent hover:underline'}"
						>
							<svelte:component this={item.icon} class="mr-2 h-4 w-4" />
							{item.label}
						</Button>
					{/each}
				</nav>
				<div class="mt-1">
					<form method="post" action="/account?/logout" use:enhance={handleLogout}>
						<Button
							type="submit"
							variant="ghost"
							class="w-full justify-start hover:bg-transparent hover:underline"
						>
							<LogOut class="mr-2 h-4 w-4" />
							{m.wacky_big_raven_honor()}
						</Button>
					</form>
				</div>
			</aside>

			<!-- Main Content Area -->
			<div class="flex-1 lg:max-w-3xl">
				{#if routeRequiresEncryption && !keyRestoreAttempted}
					<div class="flex justify-center py-12">
						<Spinner class="h-6 w-6" />
					</div>
				{:else if showEncryptionSetup}
					<Card>
						<div class="py-8 text-center">
							<p class="text-muted-foreground mb-4">{m.tense_calm_seal_warn()}</p>
							<Button href={localizeHref('/account/settings')}>{m.bold_safe_tiger_lock()}</Button>
						</div>
					</Card>
				{:else if showEncryptionGate}
					<Card>
						<div class="py-8 text-center">
							<p class="text-muted-foreground mb-4">{m.dim_quiet_raven_lock()}</p>
							<Button href={localizeHref('/encryption')}>{m.maroon_heavy_lemur_emerge()}</Button>
						</div>
					</Card>
				{:else}
					{@render children()}
				{/if}
			</div>
		</div></Container
	>
</PageWrapper>
