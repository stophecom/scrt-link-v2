<script lang="ts">
	import { mode } from 'mode-watcher';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import * as Avatar from '$lib/components/ui/avatar';
	import Container from '$lib/components/ui/container/container.svelte';
	import { localizeHref } from '$lib/paraglide/runtime';

	type Props = {
		isPersistent?: boolean;
		logoDarkMode?: string;
		logo?: string;
		wide?: boolean;
		name: string | null;
		user: App.Locals['user'];
		children?: Snippet;
	};

	let {
		isPersistent,
		logo,
		logoDarkMode,
		user,
		wide,
		name,
		...rest
	}: Props & SvelteHTMLElements['header'] = $props();

	let logoSrc = $derived(mode.current === 'dark' ? logoDarkMode : logo);
</script>

<header class={isPersistent ? 'bg-background shadow-sm' : ''} {...rest}>
	<Container class="flex justify-between py-1" variant={wide ? 'wide' : 'default'}>
		{#if isPersistent}
			<a class="inline-flex h-16 w-36 items-center" href={localizeHref('/')}>
				{#if logoSrc}
					<img src={logoSrc} alt="Logo" class="max-h-full max-w-full object-contain" />
				{:else}
					<span class="font-medium">{name}</span>
				{/if}
			</a>
		{/if}
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
			{/if}
		</div>
	</Container>
</header>
