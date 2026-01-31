<script lang="ts">
	import Logo from '$lib/assets/images/logo.svg?component';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import { appName, uptimerobotUrl } from '../../data/app';
	import { companyMenu, helpMenu, imprintMenu, productMenu, secretMenu } from '../../data/menu';
	import Container from '../ui/container/container.svelte';
	import LanguageSwitcher from '../ui/language-switcher';
	import FooterMenu from '../ui/menu';
</script>

<footer class="border-border bg-background border-t pt-14 shadow-[0_0_60px_0_rgba(0,0,0,0.08)]">
	<Container variant="wide" class="flex flex-col">
		<div class="w-full md:flex">
			<div class="min-w-52 shrink-0 pr-10 pb-10">
				<div class="flex items-center">
					<Logo class="h-10 w-10" />
					<span class=" text-lg font-semibold">{appName}</span>
				</div>
			</div>

			<div class="mb-4 grid w-full grid-cols-2 items-start gap-4 pt-1 md:grid-cols-4">
				<FooterMenu title={m.funny_swift_jay_promise()} menu={secretMenu()} />
				<FooterMenu title={m.tiny_suave_nils_accept()} menu={productMenu()} />
				<FooterMenu title={m.chunky_raw_osprey_dial()} menu={companyMenu()} />
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
				{#each imprintMenu() as menuItem (menuItem.href)}
					<a class="hover:text-foreground pe-4 underline" href={localizeHref(menuItem.href)}>
						{menuItem.label}
					</a>
				{/each}
				<span class="text-nowrap">
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a class="hover:text-foreground py-2 pe-0 underline" target="_blank" href={uptimerobotUrl}
						>{m.real_proud_dolphin_attend()}</a
					>
					<span class="text-success ps-1 text-[0.7rem]">●</span>
				</span>
			</div>

			<div class="ms-auto flex justify-center py-5 md:py-2">
				<LanguageSwitcher />
			</div>
		</div>
	</Container>
</footer>
