<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu';
	import { mainNav, type MenuItem } from '$lib/data/menu';
	import { localizeHref } from '$lib/paraglide/runtime';

	const nav = $derived(mainNav());

	let value = $state('');
	let root = $state<HTMLElement | null>(null);

	// Align the flyout with the trigger that opened it (claude.com style),
	// instead of pinning it to the start of the nav.
	const viewportOffset = $derived.by(() => {
		if (!value || !root) return 0;
		const index = nav.findIndex((group) => group.title === value);
		if (index < 0) return 0;
		const trigger = root.querySelectorAll<HTMLElement>('[data-slot="navigation-menu-trigger"]')[
			index
		];
		if (!trigger) return 0;
		return trigger.getBoundingClientRect().left - root.getBoundingClientRect().left;
	});
</script>

{#snippet menuItems(items: MenuItem[], columns = 1)}
	<ul class="grid gap-0.5" class:grid-cols-2={columns === 2}>
		{#each items as item (item.href)}
			{@const Icon = item.icon}
			<li>
				<NavigationMenu.Link
					href={item.externalLink ? item.href : localizeHref(item.href)}
					target={item.externalLink ? '_blank' : undefined}
					rel={item.externalLink ? 'noreferrer' : undefined}
				>
					{#if Icon}
						<span class="bg-muted text-primary flex rounded-md p-1.5">
							<Icon class="h-4 w-4" />
						</span>
					{/if}
					<span>{item.label}</span>
					{#if item.badge}
						<span
							class="bg-foreground text-background ms-auto inline-flex rounded-full px-[5px] py-[1px] text-[9px] font-semibold uppercase"
							>{item.badge}</span
						>
					{/if}
				</NavigationMenu.Link>
			</li>
		{/each}
	</ul>
{/snippet}

<NavigationMenu.Root bind:ref={root} bind:value {viewportOffset} class="hidden lg:flex">
	<NavigationMenu.List>
		{#each nav as group (group.title)}
			<NavigationMenu.Item value={group.title}>
				{#if group.href}
					<NavigationMenu.Link href={localizeHref(group.href)} class={navigationMenuTriggerStyle}>
						{group.title}
					</NavigationMenu.Link>
				{:else if group.sections}
					{@const sections = group.sections}
					<NavigationMenu.Trigger>{group.title}</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						{#if sections.length > 1}
							<div class="grid w-[36rem] grid-cols-3 gap-4 p-4">
								{#each sections as section (section.title)}
									<div>
										<h3 class="text-muted-foreground px-3 pb-1 text-xs font-semibold uppercase">
											{section.title}
										</h3>
										{@render menuItems(section.items)}
									</div>
								{/each}
							</div>
						{:else}
							<div class="w-[28rem] p-3">
								{@render menuItems(sections[0].items, 2)}
							</div>
						{/if}
					</NavigationMenu.Content>
				{/if}
			</NavigationMenu.Item>
		{/each}
	</NavigationMenu.List>
</NavigationMenu.Root>
