<script lang="ts">
	import { ArrowRight, Check, Rocket } from 'lucide-svelte';
	import BadgeCheck from 'lucide-svelte/icons/badge-check';
	import LogOut from 'lucide-svelte/icons/log-out';
	import { PersistedState } from 'runed';

	import DarkModeSwitcher from '$lib/components/elements/dark-mode-switcher.svelte';
	import SettingsForm from '$lib/components/forms/settings-form.svelte';
	import ThemeForm from '$lib/components/forms/theme-form.svelte';
	import UserForm from '$lib/components/forms/user-form.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import Markdown from '$lib/components/ui/markdown';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { TierOptions } from '$lib/data/enums';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../$types';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData & LayoutServerData } = $props();

	const { user } = data;

	const usps = [
		m.weary_antsy_lionfish_pat(),
		m.shy_suave_donkey_gasp(),
		m.this_ideal_racoon_link(),
		m.basic_just_camel_clasp(),
		m.candid_noble_cobra_fetch()
	];

	const hidePremiumPromo = new PersistedState<boolean>('hidePremiumPromo', false);
</script>

{#snippet renderLabel(label: string)}
	<span class="inline-block p-1 font-medium">{label}</span>
{/snippet}

<Page
	title={m.zany_jolly_cuckoo_scoop({ name: user.name || m.quiet_long_beaver_scold() })}
	lead={m.gray_quiet_tern_bubble()}
>
	{#if user.subscriptionTier !== TierOptions.CONFIDENTIAL}
		<Button class="mb-6" variant="outline" href="/pricing">{m.short_male_racoon_prosper()}</Button>
	{:else if !hidePremiumPromo.current}
		<Card
			title={m.red_less_tapir_edit()}
			description={m.few_short_gull_taste()}
			class="border-primary relative mb-6 border-2"
		>
			<Rocket class="absolute top-5 right-5" />
			<ul class="mb-6">
				{#each usps as item}
					<li class="flex items-center py-1 sm:text-lg">
						<Check class="text-primary me-2" />
						<Markdown markdown={item} />
					</li>
				{/each}
			</ul>

			<div class="grid grid-rows-2 gap-2 sm:flex sm:justify-between">
				<Button variant="outline" onclick={() => (hidePremiumPromo.current = true)}
					>{m.proud_awake_shark_drum()}</Button
				>

				<Button class="sm:ml-auto" href="/pricing"
					><ArrowRight class="mr-2 h-5 w-5" />{m.quick_sweet_angelfish_lend()}</Button
				>
			</div>
		</Card>
	{/if}

	<Card class="mb-6" title={m.vivid_house_flea_zap()} description={m.wacky_key_vole_roam()}>
		<SettingsForm {user} form={data.settingsForm} />
	</Card>

	<Card class="mb-6" title="Appearance" description="Choose your favorite theme color.">
		<div class="mb-2">
			<ThemeForm form={data.themeForm} />
		</div>
		<DarkModeSwitcher variant="outline" />
	</Card>

	<Card class="mb-6" title={m.novel_proud_anaconda_zoom()}>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<div class="flex py-1">
					{@render renderLabel(m.mild_noble_orangutan_compose())}
					<span class="inline-flex cursor-not-allowed items-center p-1"
						>{user.email} <BadgeCheck class="text-muted-foreground ms-2 h-4 w-4" /></span
					>
				</div>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{m.dizzy_light_pigeon_animate()}</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<div class="flex py-1">
			{@render renderLabel(m.weird_ok_sparrow_praise())}
			<span class="inline-block p-1"
				>{user.subscriptionTier}
				(<a class="hover:text-primary underline" href="/pricing">{m.good_wacky_alligator_dare()}</a
				>)</span
			>
		</div>

		<Separator class="my-6" />

		<UserForm form={data.userForm} />

		<Separator class="my-6" />
		<div class="flex flex-wrap">
			<Button class="mr-2 mb-2" variant="outline" href="/set-password"
				>{m.jumpy_factual_mole_hunt()}</Button
			>

			<Button variant="ghost" href="/delete-account" class="text-destructive"
				>{m.home_sharp_jackdaw_endure()}</Button
			>
		</div>
	</Card>

	<form class="flex justify-center" method="post" action="?/logout">
		<Button type="submit" variant="ghost"
			><LogOut class="me-2 h-4 w-4" />{m.wacky_big_raven_honor()}</Button
		>
	</form>
</Page>
