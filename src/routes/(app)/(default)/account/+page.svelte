<script lang="ts">
	import { ArrowRight, Check, Rocket, Trash } from 'lucide-svelte';
	import LogOut from 'lucide-svelte/icons/log-out';
	import { PersistedState } from 'runed';

	import { enhance } from '$app/forms';
	import DarkModeSwitcher from '$lib/components/elements/dark-mode-switcher.svelte';
	import ApiTokenForm from '$lib/components/forms/api-token-form.svelte';
	import SettingsForm from '$lib/components/forms/settings-form.svelte';
	import ThemeForm from '$lib/components/forms/theme-form.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import CopyButton from '$lib/components/ui/copy-button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Markdown from '$lib/components/ui/markdown';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Role } from '$lib/data/enums';
	import { getPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { LayoutServerData } from '../../$types';
	import type { PageServerData } from './$types';
	import AccountCard from './account-card.svelte';
	import WhiteLabelCard from './white-label-card.svelte';

	let { data }: { data: PageServerData & LayoutServerData } = $props();

	const { user } = data;

	const usps = [
		m.weary_antsy_lionfish_pat(),
		m.shy_suave_donkey_gasp(),
		m.this_ideal_racoon_link(),
		m.basic_just_camel_clasp(),
		m.candid_noble_cobra_fetch()
	];

	const planLimits = getPlanLimits(user?.subscriptionTier);

	const hidePremiumPromo = new PersistedState<boolean>('hidePremiumPromo', false);
</script>

<Page
	title={m.zany_jolly_cuckoo_scoop({
		name: data.userForm.data.name || m.quiet_long_beaver_scold()
	})}
	lead={m.gray_quiet_tern_bubble()}
>
	{#if !hidePremiumPromo.current}
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

				<Button class="sm:ml-auto" href={localizeHref('/pricing')}
					><ArrowRight class="mr-2 h-5 w-5" />{m.quick_sweet_angelfish_lend()}</Button
				>
			</div>
		</Card>
	{/if}

	{#if user.role === Role.ADMIN}
		<Button variant="outline" class="mb-6" href={localizeHref('/admin')}>Admin Panel</Button>
	{/if}

	<AccountCard {user} form={data.userForm} />

	<Card class="mb-6" title={m.vivid_house_flea_zap()} description={m.wacky_key_vole_roam()}>
		<SettingsForm {user} form={data.settingsForm} />
	</Card>

	<Card class="mb-6" title={m.shy_smug_crow_sing()} description={m.left_patchy_piranha_foster()}>
		<div class="mb-2">
			<ThemeForm form={data.themeForm} />
		</div>
		<DarkModeSwitcher variant="outline" />
	</Card>

	{#if planLimits.whiteLabel}
		<WhiteLabelCard form={data.whiteLabelForm} />
	{/if}

	{#if planLimits.apiAccess}
		<Card
			class="mb-6"
			title={m.super_funny_jackal_pause()}
			description={m.patchy_swift_fish_cuddle()}
		>
			<h3 class="mt-6 text-xl font-semibold">{m.actual_keen_rooster_find()}</h3>
			<ApiTokenForm {user} form={data.apiKeyForm} />

			{#if data.apiKeys.length}
				<h3 class="mt-6 mb-2 text-xl font-semibold">{m.lost_slimy_pelican_achieve()}</h3>
				{#each data.apiKeys as item}
					<div
						class="bg-background/60 border-border mb-3 grid grid-cols-[100px_1fr] gap-2 overflow-hidden border p-2 px-4 sm:grid-cols-[100px_1fr_min-content_min-content]"
					>
						<div
							class="max-w-full items-center justify-center self-center justify-self-start truncate text-sm"
						>
							{item.description}
						</div>
						<Input type="text" value={item.key} disabled />
						<div class="col-span-2 flex justify-end">
							<CopyButton variant="ghost" text={item.key}></CopyButton>

							<form class="flex justify-center" method="post" use:enhance action="?/revokeAPIToken">
								<input type="hidden" name="keyId" value={item.id} />
								<Button type="submit" variant="ghost" class="text-destructive"
									><Trash class="me-2 h-4 w-4" />{m.tense_spicy_jannes_hug()}</Button
								>
							</form>
						</div>
					</div>
				{/each}
			{/if}

			<Separator class="my-6" />

			<Button variant="outline" href={localizeHref('/developers')}>Read the documentation</Button>
		</Card>
	{/if}

	<form class="flex justify-center" method="post" action="?/logout">
		<Button type="submit" variant="outline"
			><LogOut class="me-2 h-4 w-4" />{m.wacky_big_raven_honor()}</Button
		>
	</form>
</Page>
