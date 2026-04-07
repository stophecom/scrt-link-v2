<script lang="ts">
	import { mode } from 'mode-watcher';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import { page } from '$app/state';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import Container from '$lib/components/ui/container/container.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let isLoginPage = $derived(page.url.pathname.endsWith('/login'));

	type Props = {
		logoDarkMode?: string;
		logo?: string;
		wide?: boolean;
		name: string | null;
		user: App.Locals['user'];
	};

	let { logo, logoDarkMode, user, wide, name, ...rest }: Props & SvelteHTMLElements['header'] =
		$props();

	let logoSrc = $derived(mode.current === 'dark' ? logoDarkMode : logo);
</script>

<header class="bg-background shadow-sm" {...rest}>
	<Container class="flex justify-between py-2" variant={wide ? 'wide' : 'default'}>
		<a class="inline-flex h-12 w-36 items-center" href={localizeHref('/')}>
			{#if logoSrc}
				<img src={logoSrc} alt="Logo" class="max-h-full max-w-full object-contain" />
			{:else}
				<span class="font-medium">{name}</span>
			{/if}
		</a>
		<div class="ml-auto flex items-center">
			{#if user}
				<a href={localizeHref('/account')} class="relative ms-2">
					<Avatar.Root>
						<Avatar.Image src={user.picture} alt={user.name} />
						<Avatar.Fallback
							class="border-foreground bg-foreground text-background border uppercase"
							>{Array.from(user.email)[0]}</Avatar.Fallback
						>
					</Avatar.Root>
				</a>
			{:else if !isLoginPage}
				<Button variant="outline" href={localizeHref('/login')}>{m.simple_dry_boar_dazzle()}</Button
				>
			{/if}
		</div>
	</Container>
</header>
