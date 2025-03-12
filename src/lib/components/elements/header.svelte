<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import Plane from 'lucide-svelte/icons/plane';
	import Rocket from 'lucide-svelte/icons/rocket';
	import { backInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	import Logo from '$lib/assets/images/logo.svg?component';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { appName } from '$lib/data/app';
	import { TierOptions } from '$lib/data/enums';
	import { secretMenu } from '$lib/data/menu';
	import * as m from '$lib/paraglide/messages.js';

	import IntersectionObserver from '../helpers/intersection-observer.svelte';
	import MediaQuery from '../helpers/media-query.svelte';
	import DarkModeSwitcher from './dark-mode-switcher.svelte';

	let {
		user,
		minimal,
		hideCreateSecretButton
	}: { user: App.Locals['user']; minimal?: boolean; hideCreateSecretButton?: boolean } = $props();
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
							: 'translate-x-0 scale-100 opacity-100'}">{appName}</span
					>
				</a>

				<div class="ml-auto grid grid-flow-col items-center gap-2">
					{#if !minimal && !hideCreateSecretButton}
						<MediaQuery query="not (min-width: 40rem)" let:matches>
							<div
								in:scale={{ easing: backInOut, duration: 500 }}
								class={matches
									? 'rounded-full max-sm:fixed max-sm:right-6 max-sm:bottom-6 max-sm:shadow-xl'
									: ''}
							>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild let:builder
										><Button
											builders={[builder]}
											variant={matches ? 'default' : 'ghost'}
											size={matches ? 'floating' : 'icon'}
											class={matches ? 'rounded-full' : ''}
										>
											<Plus
												class="transition-all {builder['data-state'] === 'open'
													? 'rotate-45'
													: 'rotate-0'}"
											/>
											<span class="sr-only">{m.ideal_brave_eagle_trust()}</span></Button
										></DropdownMenu.Trigger
									>
									<DropdownMenu.Content class="w-56">
										<DropdownMenu.Label>{m.ideal_brave_eagle_trust()}</DropdownMenu.Label>
										<DropdownMenu.Separator />

										{#each secretMenu() as menuItem}
											<DropdownMenu.Item href={menuItem.href}>
												<menuItem.icon class="me-2 h-4 w-4" />{menuItem.label}</DropdownMenu.Item
											>
										{/each}
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</MediaQuery>
					{/if}
					{#if user}
						<a href="/account" class="relative mr-2">
							<Avatar.Root>
								<Avatar.Image src={user.picture} alt={user.name} />
								<Avatar.Fallback
									class="border-foreground bg-foreground text-background border uppercase"
									>{Array.from(user.email)[0]}</Avatar.Fallback
								>
							</Avatar.Root>
							{#if user.subscriptionTier === TierOptions.SECRET || user.subscriptionTier === TierOptions.TOP_SECRET}
								<div
									class="border-background bg-primary text-primary-foreground absolute -right-[2px] -bottom-[2px] rounded-full border p-[3px]"
								>
									{#if user.subscriptionTier === TierOptions.SECRET}
										<Plane class="h-3 w-3" />
									{/if}
									{#if user.subscriptionTier === TierOptions.TOP_SECRET}
										<Rocket class="h-3 w-3" />
									{/if}
								</div>
							{/if}
						</a>
					{:else}
						<DarkModeSwitcher hideLabel variant="ghost" size="icon" class="max-xs:hidden" />
						<Button variant="outline" href="/login">{m.simple_dry_boar_dazzle()}</Button>
						<Button href="/signup">{m.large_smart_badger_beam()}</Button>
					{/if}
				</div>
			</div>
		</div>
	</header>
</IntersectionObserver>
