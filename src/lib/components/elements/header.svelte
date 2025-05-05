<script lang="ts">
	import { Factory, Plus, User, X } from 'lucide-svelte';
	import Plane from 'lucide-svelte/icons/plane';
	import Rocket from 'lucide-svelte/icons/rocket';
	import { PersistedState } from 'runed';

	import Logo from '$lib/assets/images/logo.svg?component';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Container } from '$lib/components/ui/container';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { appName } from '$lib/data/app';
	import { TierOptions } from '$lib/data/enums';
	import { secretMenu } from '$lib/data/menu';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import IntersectionObserver from '../helpers/intersection-observer.svelte';
	import DarkModeSwitcher from './dark-mode-switcher.svelte';

	type Props = { user: App.Locals['user']; minimal?: boolean; business?: boolean };

	let { user, minimal, business }: Props = $props();

	let persistHeader = $derived(minimal || business);

	const showBusinessAnnouncement = new PersistedState<boolean>('showBusinessAnnouncement', true);

	const headerHeight = $derived(showBusinessAnnouncement.current ? '104px' : '64px');

	$effect(() => {
		document.documentElement.style.setProperty('--header-height', headerHeight);
	});
</script>

<IntersectionObserver let:intersecting bottom={persistHeader ? 0 : 100}>
	<header class="relative z-10 h-[var(--header-height)] transition-all">
		<div
			class="fixed top-0 left-0 h-[var(--header-height)] w-full transition-all duration-300 ease-in-out {intersecting &&
			!persistHeader
				? 'bg-transparent'
				: 'bg-background shadow-sm'}"
		>
			{#if showBusinessAnnouncement.current}
				<div class="bg-primary text-primary-foreground">
					<Container variant={'wide'} class=" flex h-10 items-center text-xs sm:text-sm">
						<strong>{m.solid_heroic_ibex_coax()}</strong>
						<a
							class="after:bg-primary-foreground before:bg-primary-foreground relative ms-2 inline-block py-2 before:absolute before:bottom-2 before:left-0 before:h-[1px] before:w-full before:opacity-50 after:absolute after:bottom-2 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100"
							href={localizeHref('/business')}>{m.soft_tame_niklas_enchant()}</a
						>
						<button
							class="ml-auto block p-2"
							onclick={() => {
								showBusinessAnnouncement.current = false;
							}}
							><X class="h-5 w-5" /><span class="sr-only">{m.steep_brave_sloth_list()}</span
							></button
						>
					</Container>
				</div>
			{/if}
			<Container variant={'wide'} class="flex h-16 items-center">
				<a
					class="flex items-center py-2 transition duration-150 ease-in-out {intersecting &&
					!persistHeader
						? 'translate-x-4 scale-150 opacity-0'
						: 'scale-100 opacity-100'}"
					href={localizeHref('/')}
				>
					<Logo class="h-10 w-10" />
					<span class="sr-only">{m.red_trite_turkey_flip()}</span>
					<span
						class="p-2 text-lg font-semibold transition delay-100 duration-150 ease-in-out {intersecting &&
						!persistHeader
							? 'hidden translate-x-4 scale-150 opacity-0'
							: 'visible translate-x-0 scale-100 opacity-100'}">{appName}</span
					>
					{#if business}
						<span class="bg-foreground text-background inline-flex rounded-md px-2 py-1 text-xs"
							>business</span
						>
					{/if}
				</a>

				<div class="ml-auto grid grid-flow-col items-center gap-2">
					{#if !persistHeader && user}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder
								><Button builders={[builder]} variant="ghost" size="icon">
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
									<DropdownMenu.Item href={localizeHref(menuItem.href)}>
										<menuItem.icon class="me-2 h-4 w-4" />{menuItem.label}</DropdownMenu.Item
									>
								{/each}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{/if}
					{#if user}
						<a href={localizeHref('/account')} class="relative mr-2">
							<Avatar.Root>
								<Avatar.Image src={user.picture} alt={user.name} />
								<Avatar.Fallback
									class="border-foreground bg-foreground text-background border uppercase"
									>{Array.from(user.email)[0]}</Avatar.Fallback
								>
							</Avatar.Root>

							{#if user.subscriptionTier && [TierOptions.SECRET, TierOptions.TOP_SECRET, TierOptions.SECRET_SERVICE].includes(user.subscriptionTier)}
								<div
									class="border-background bg-primary text-primary-foreground absolute -right-[2px] -bottom-[2px] rounded-full border p-[3px]"
								>
									{#if user.subscriptionTier === TierOptions.SECRET}
										<Plane class="h-3 w-3" />
									{/if}
									{#if user.subscriptionTier === TierOptions.TOP_SECRET}
										<Rocket class="h-3 w-3" />
									{/if}
									{#if user.subscriptionTier === TierOptions.SECRET_SERVICE}
										<Factory class="h-3 w-3" />
									{/if}
								</div>
							{/if}
						</a>
					{:else}
						<DarkModeSwitcher hideLabel variant="ghost" size="icon" class="max-xs:hidden" />
						<Button variant="outline" href={localizeHref('/login')} class="max-sm:h-12 max-sm:w-12">
							<span class="max-sm:sr-only">{m.simple_dry_boar_dazzle()}</span>
							<User class="h-5 w-5 sm:hidden" />
						</Button>
						<Button href={localizeHref('/signup')}>{m.large_smart_badger_beam()}</Button>
					{/if}
				</div>
			</Container>
		</div>
	</header>
</IntersectionObserver>
