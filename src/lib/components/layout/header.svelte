<script lang="ts">
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import { toggleMode } from 'mode-watcher';

	import Logo from '$lib/assets/images/logo.svg?component';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../../routes/$types';
	import IntersectionObserver from '../helpers/intersection-observer.svelte';

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
					<Button on:click={toggleMode} variant="outline" size="icon">
						<Sun
							class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
						/>
						<Moon
							class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
						/>
						<span class="sr-only">{m.hour_lofty_warthog_wish()}</span>
					</Button>
					{#if user}
						<a class="flex items-center" href="/account">
							<Avatar.Root class="mr-2">
								<Avatar.Image src={user.picture} alt={user.name} />
								<Avatar.Fallback
									class="border-foreground bg-foreground text-background border uppercase"
									>{Array.from(user.email)[0]}</Avatar.Fallback
								>
							</Avatar.Root>
						</a>
					{:else}
						<Button variant="outline" href="/login">{m.simple_dry_boar_dazzle()}</Button>
						<Button href="/signup">{m.large_smart_badger_beam()}</Button>
					{/if}
				</div>
			</div>
		</div>
	</header>
</IntersectionObserver>
