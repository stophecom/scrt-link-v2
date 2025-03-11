<script lang="ts">
	import Crown from 'lucide-svelte/icons/crown';

	import Logo from '$lib/assets/images/logo.svg?component';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { accountMenuHeader } from '$lib/data/menu';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../../routes/$types';
	import IntersectionObserver from '../helpers/intersection-observer.svelte';
	import DarkModeSwitcher from './dark-mode-switcher.svelte';

	let { user, minimal }: { user: LayoutServerData['user']; minimal?: boolean } = $props();
</script>

<IntersectionObserver let:intersecting bottom={minimal ? 0 : 100}>
	<header class="relative z-10 h-16">
		<div
			class="fixed top-0 left-0 h-16 w-full transition duration-300 ease-in-out {intersecting
				? 'bg-transparent'
				: 'bg-background shadow-sm'}"
		>
			<div class="container flex h-full items-center">
				<a
					data-sveltekit-reload
					class="flex items-center py-2 transition duration-150 ease-in-out {intersecting &&
					!minimal
						? 'translate-x-4 scale-150 opacity-0'
						: 'scale-100 opacity-100'}"
					href="/"
				>
					<Logo class="h-10 w-10" />
					<span
						class="p-2 text-lg font-semibold transition delay-100 duration-150 ease-in-out {intersecting &&
						!minimal
							? 'translate-x-4 scale-150 opacity-0'
							: 'translate-x-0 scale-100 opacity-100'}">scrt.link</span
					>
				</a>

				<div class="ml-auto grid grid-flow-col gap-2">
					<DarkModeSwitcher hideLabel variant="ghost" size="icon" />

					{#if user}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Avatar.Root class="mr-2">
									<Avatar.Image src={user.picture} alt={user.name} />
									<Avatar.Fallback
										class="border-foreground bg-foreground text-background border uppercase"
										>{Array.from(user.email)[0]}</Avatar.Fallback
									>
								</Avatar.Root>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-56">
								{#each accountMenuHeader() as menuItem}
									<DropdownMenu.Item href={menuItem.href}
										><menuItem.icon class="me-2 h-4 w-4" />{menuItem.label}</DropdownMenu.Item
									>
								{/each}
								<DropdownMenu.Item href="/pricing"
									><Crown class="me-2 h-4 w-4" />Upgrade
									<span
										class="bg-primary text-primary-foreground ms-3 rounded-full px-2 text-xs font-medium uppercase"
										>50% off</span
									></DropdownMenu.Item
								>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{:else}
						<Button variant="outline" href="/login">{m.simple_dry_boar_dazzle()}</Button>
						<Button href="/signup">{m.large_smart_badger_beam()}</Button>
					{/if}
				</div>
			</div>
		</div>
	</header>
</IntersectionObserver>
