<script lang="ts">
	import Key from '@lucide/svelte/icons/key';
	import Lock from '@lucide/svelte/icons/lock';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Menu from '@lucide/svelte/icons/menu';
	import SettingsGroup from '@lucide/svelte/icons/settings';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import User from '@lucide/svelte/icons/user';
	import Users from '@lucide/svelte/icons/users';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';

	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import PageTitle from '$lib/components/blocks/page-title.svelte';
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

	let { children }: { children: Snippet } = $props();

	let pageTitle = $derived(page.data.pageTitle);

	// Navigation items
	const navItems = [
		{
			href: localizeHref('/account/secrets'),
			label: m.free_nimble_whale_fry(),
			icon: Lock
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
			href: localizeHref('/account/secret-service'),
			label: TierOptions.SECRET_SERVICE,
			icon: ShieldCheck
		},
		{
			href: localizeHref('/account/profile'),
			label: m.super_flaky_wallaby_pick(),
			icon: User
		},
		{
			href: localizeHref('/account/settings'),
			label: m.nimble_quick_bird_sew(),
			icon: SettingsGroup
		}
	];

	let currentPath = $derived(page.url.pathname);
	let currentItem = $derived(
		navItems.find((item) => currentPath.startsWith(item.href)) || navItems[0]
	);
</script>

<QueryClientProvider client={queryClient}>
	<PageWrapper metaTitle={currentItem.label}>
		<Container variant="wide" class="py-6">
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
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<form class="w-full" method="post" action="/account?/logout">
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
						<form method="post" action="/account?/logout">
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
					<PageTitle class="xs:text-2xl mb-4 text-2xl md:text-4xl" title={pageTitle} />

					{@render children()}
				</div>
			</div>
		</Container>
	</PageWrapper>
</QueryClientProvider>
