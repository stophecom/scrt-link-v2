<script lang="ts">
	import Logo from '$lib/assets/images/logo.svg?component';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import { uptimerobotUrl } from '../../data/app';
	import { aboutMenu, helpMenu, imprintMenu, secretMenu } from '../../data/menu';
	import LanguageSwitcher from '../ui/language-switcher';
	import FooterMenu from '../ui/menu';
</script>

<footer class="border-border bg-background border-t pt-14 shadow-[0_0_60px_0_rgba(0,0,0,0.08)]">
	<div class="container flex flex-col">
		<div class="w-full md:flex">
			<div class="min-w-52 shrink-0 pr-10 pb-10">
				<div class="flex items-center">
					<Logo class="h-10 w-10" />
					<span class=" text-lg font-semibold">scrt.link</span>
				</div>
			</div>

			<div class="mb-4 grid w-full grid-cols-2 items-start gap-4 pt-1 md:grid-cols-3">
				<FooterMenu title={m.funny_swift_jay_promise()} menu={secretMenu()} />
				<FooterMenu title={m.mellow_lucky_bee_jolt()} menu={aboutMenu()} />
				<FooterMenu title={m.equal_away_frog_aim()} menu={helpMenu()} />
			</div>
		</div>

		<div class="text-muted-foreground py-5 text-sm">
			{m.candid_red_lynx_offer()}
		</div>

		<Separator class="mb-2" />

		<div class="pb-8 md:flex">
			<div class="text-muted-foreground flex flex-wrap items-center text-sm">
				<span class="py-2 pe-4">©{new Date().getFullYear()} SANTiHANS GmbH</span>
				{#each imprintMenu() as menuItem}
					<a class="hover:text-foreground pe-4 underline" href={localizeHref(menuItem.href)}>
						{menuItem.label}
					</a>
				{/each}
				<span class="text-nowrap">
					<a class="hover:text-foreground py-2 pe-0 underline" target="_blank" href={uptimerobotUrl}
						>Status</a
					>
					<span class="text-success ps-1 text-[0.7rem]">●</span>
				</span>
			</div>

			<div class="ms-auto flex justify-center py-5 md:py-2">
				<LanguageSwitcher />
			</div>
		</div>
	</div>
</footer>
