<script lang="ts">
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import { toggleMode } from 'mode-watcher';

	import Logo from '$lib/assets/images/logo.svg?component';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button/index.js';

	import type { LayoutServerData } from '../../../routes/$types';
	import IntersectionObserver from '../helpers/intersection-observer.svelte';

	let { user, minimal }: { user: LayoutServerData['user']; minimal: boolean } = $props();
</script>

<IntersectionObserver let:intersecting bottom={minimal ? 0 : 100}>
	<header class="relative z-10 h-16">
		<div
			class="fixed left-0 top-0 h-16 w-full transition duration-300 ease-in-out {intersecting
				? 'bg-transparent'
				: 'bg-background shadow'}"
		>
			<div class="container flex h-full items-center">
				<a
					class="flex items-center p-2 transition duration-150 ease-in-out {intersecting && !minimal
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

				<!-- <a class="p-2 hover:text-primary" href="/text">Text</a> -->

				<div class="ml-auto grid grid-flow-col gap-2">
					<Button on:click={toggleMode} variant="outline" size="icon">
						<Sun
							class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						/>
						<Moon
							class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
					{#if user}
						<a class="flex items-center" href="/account">
							<Avatar.Root class="mr-2">
								<Avatar.Image src={user.picture} alt={user.name} />
								<Avatar.Fallback class="uppercase">{Array.from(user.email)[0]}</Avatar.Fallback>
							</Avatar.Root>
							<span class="font-medium">{user.name}</span>
						</a>
					{:else}
						<Button variant="outline" href="/login">Login</Button>
						<Button href="/signup">Sign up free</Button>
					{/if}
				</div>
			</div>
		</div>
	</header>
</IntersectionObserver>
