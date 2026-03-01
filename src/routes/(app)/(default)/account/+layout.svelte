<script lang="ts">
	import Key from '@lucide/svelte/icons/key';
	import Lock from '@lucide/svelte/icons/lock';
	import Menu from '@lucide/svelte/icons/menu';
	import SettingsGroup from '@lucide/svelte/icons/settings';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import Users from '@lucide/svelte/icons/users';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import PageWrapper from '$lib/components/blocks/page-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { TierOptions } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	// Create a client for react query
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { data, children }: { data: any; children: Snippet } = $props();

	// Navigation items
	const navItems = [
		{
			href: localizeHref('/account/secrets'),
			label: m.free_nimble_whale_fry(),
			icon: Lock
		},
		{
			href: localizeHref('/account/settings'),
			label: m.super_flaky_wallaby_pick(),
			icon: SettingsGroup
		},
		{
			href: localizeHref('/account/api'),
			label: m.super_funny_jackal_pause(),
			icon: Key
		},
		{
			href: localizeHref('/account/organization'),
			label: m.wild_inner_fox_honor(),
			icon: Users
		},
		{
			href: localizeHref('/account/white-label'),
			label: TierOptions.SECRET_SERVICE,
			icon: ShieldCheck
		}
	];

	let currentPath = $derived($page.url.pathname);
	let currentItem = $derived(
		navItems.find((item) => currentPath.startsWith(item.href)) || navItems[0]
	);
</script>

<QueryClientProvider client={queryClient}>
	<PageWrapper metaTitle={currentItem.label}>
		<Container variant="wide">
			<div class="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
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
									<DropdownMenu.Item
										class={currentPath === item.href ? 'bg-muted font-medium' : ''}
									>
										<a href={item.href} class="flex w-full items-center">
											<svelte:component this={item.icon} class="mr-2 h-4 w-4" />
											<span>{item.label}</span>
										</a>
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>

				<!-- Desktop Navigation (Sidebar) -->
				<aside class="hidden lg:block lg:w-1/4">
					<nav class="flex flex-col space-y-1">
						{#each navItems as item}
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
				</aside>

				<!-- Main Content Area -->
				<div class="flex-1 lg:max-w-3xl">
					{@render children()}
				</div>
			</div>
		</Container>
	</PageWrapper>
</QueryClientProvider>
