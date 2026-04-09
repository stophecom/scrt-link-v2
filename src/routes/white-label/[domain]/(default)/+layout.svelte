<script lang="ts">
	import { type Snippet } from 'svelte';

	import { page } from '$app/state';
	import DarkModeSwitcher from '$lib/components/blocks/dark-mode-switcher.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import LanguageSwitcher from '$lib/components/ui/language-switcher';
	import { m } from '$lib/paraglide/messages.js';

	import Header from '../header.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { data: LayoutData; children: Snippet } = $props();
	let isWideLayout = $derived(page.data.wideLayout);
</script>

<Header
	logo={data.logo}
	logoDarkMode={data.logoDarkMode}
	user={data.user}
	name={data.name}
	wide={isWideLayout}
/>
{@render children()}

<footer class="border-border bg-background border-t py-4 shadow-[0_0_60px_0_rgba(0,0,0,0.08)]">
	<Container
		class="text-muted-foreground xs:flex items-center justify-between"
		variant={isWideLayout ? 'wide' : 'default'}
	>
		<div class="xs:items-start flex flex-col items-center py-2 sm:flex-row">
			<small class="pe-4">©{new Date().getFullYear()} {data.name}</small>
			<small
				>{m.empty_spicy_firefox_fade()}
				<a class="underline" href="https://scrt.link">scrt.link</a></small
			>
		</div>
		<div class="ms-auto flex items-center justify-center gap-4 py-2 sm:justify-end">
			<DarkModeSwitcher />
			<LanguageSwitcher />
		</div>
	</Container>
</footer>
