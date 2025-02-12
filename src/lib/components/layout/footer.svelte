<script lang="ts">
	import Logo from '$lib/assets/images/logo.svg?component';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { uptimerobotUrl } from '$lib/data/app';
	import { aboutMenu, helpMenu, imprintMenu, secretMenu } from '$lib/data/menu';
	import * as m from '$lib/paraglide/messages.js';

	import LanguageSwitcher from '../ui/language-switcher/language-switcher.svelte';
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
				<FooterMenu title="Secrets" menu={secretMenu()} />
				<FooterMenu title="Information" menu={aboutMenu()} />
				<FooterMenu title="Help" menu={helpMenu()} />
			</div>
		</div>

		<div class="text-muted-contrast py-5 text-sm">
			{m.candid_red_lynx_offer()}
		</div>

		<Separator class="mb-2" />

		<div class="md:flex">
			<div class="text-muted-contrast flex flex-wrap items-center text-sm">
				<span class="py-2 pe-4">©{new Date().getFullYear()} SANTiHANS GmbH</span>
				{#each imprintMenu() as menuItem}
					<a class="hover:text-foreground p-2 underline" href={menuItem.href}>
						{menuItem.label}
					</a>
				{/each}
				<span class="text-nowrap">
					<a
						class="hover:text-foreground py-2 ps-2 pe-0 underline"
						target="_blank"
						href={uptimerobotUrl}>Status</a
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
