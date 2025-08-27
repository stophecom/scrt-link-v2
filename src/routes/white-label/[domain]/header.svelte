<script lang="ts">
	import { mode } from 'mode-watcher';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import DarkModeSwitcher from '$lib/components/blocks/dark-mode-switcher.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Container from '$lib/components/ui/container/container.svelte';
	import LanguageSwitcher from '$lib/components/ui/language-switcher';
	import { localizeHref } from '$lib/paraglide/runtime';

	type Props = {
		minimal?: boolean;
		logoDarkMode?: string;
		logo?: string;
		user: App.Locals['user'];
		children?: Snippet;
	};

	let { minimal, logo, logoDarkMode, user, ...rest }: Props & SvelteHTMLElements['header'] =
		$props();

	let logoSrc = $derived(mode.current === 'dark' ? logoDarkMode : logo);
</script>

<header {...rest}>
	<Container class="flex justify-between py-3">
		{#if minimal && logoSrc}
			<a class="inline-flex h-20 w-36 items-center" href={localizeHref('/')}>
				<img src={logoSrc} alt="Logo" class="max-h-full max-w-full object-contain" />
			</a>
		{/if}
		<div class="ml-auto flex items-center">
			<DarkModeSwitcher hideLabel variant="ghost" size="icon" class="me-2" />
			<LanguageSwitcher />
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
			{/if}
		</div>
	</Container>
</header>
