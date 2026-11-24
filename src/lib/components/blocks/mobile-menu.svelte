<script lang="ts">
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { fly } from 'svelte/transition';

	import { afterNavigate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Container } from '$lib/components/ui/container';
	import FooterMenu from '$lib/components/ui/menu';
	import { mainNav } from '$lib/data/menu';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	let open = $state(false);

	const nav = $derived(mainNav());

	afterNavigate(() => (open = false));

	$effect(() => {
		if (!open) return;

		const { overflow } = document.body.style;
		document.body.style.overflow = 'hidden';

		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') open = false;
		};
		window.addEventListener('keydown', onKeydown);

		return () => {
			document.body.style.overflow = overflow;
			window.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<Button
	variant="outline"
	size="sm"
	class="gap-1.5 lg:hidden"
	aria-expanded={open}
	aria-controls="mobile-menu"
	onclick={() => (open = !open)}
>
	{#if open}
		<X class="h-4 w-4" />
	{:else}
		<Menu class="h-4 w-4" />
	{/if}
	<span class="sr-only sm:not-sr-only">{m.plain_wise_crane_navigate()}</span>
</Button>

{#if open}
	<div
		id="mobile-menu"
		class="bg-card fixed top-[var(--header-height)] right-0 bottom-0 left-0 z-40 overflow-y-auto overscroll-contain lg:hidden"
		transition:fly={{ y: -8, duration: 180 }}
	>
		<Container variant="wide" class="grid grid-cols-2 gap-x-4 gap-y-8 py-8 sm:grid-cols-3">
			{#each nav as group (group.title)}
				{#if group.href}
					<a class="text-primary p-1 font-semibold" href={localizeHref(group.href)}>
						{group.title}
					</a>
				{:else if group.sections}
					{#each group.sections as section (section.title)}
						<FooterMenu title={section.title ?? group.title} menu={section.items} />
					{/each}
				{/if}
			{/each}
		</Container>
	</div>
{/if}
