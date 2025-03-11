<script lang="ts">
	import BadgeCheck from 'lucide-svelte/icons/badge-check';
	import LogOut from 'lucide-svelte/icons/log-out';

	import DarkModeSwitcher from '$lib/components/elements/dark-mode-switcher.svelte';
	import SettingsForm from '$lib/components/forms/settings-form.svelte';
	import ThemeForm from '$lib/components/forms/theme-form.svelte';
	import UserForm from '$lib/components/forms/user-form.svelte';
	import Page from '$lib/components/page/page.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../$types';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData & LayoutServerData } = $props();

	const { user } = data;
</script>

{#snippet renderLabel(label: string)}
	<span class="inline-block p-1 font-medium">{label}</span>
{/snippet}

<Page
	title={m.zany_jolly_cuckoo_scoop({ name: user.name || m.quiet_long_beaver_scold() })}
	lead={m.gray_quiet_tern_bubble()}
>
	<Card class="mb-6">
		<div class="mb-4 flex flex-col items-center justify-center">
			<Avatar.Root class="h-16 w-16">
				<Avatar.Image src={user.picture} alt={user.name} />
				<Avatar.Fallback class="border-foreground bg-foreground text-background border uppercase"
					>{Array.from(user.email)[0]}</Avatar.Fallback
				>
			</Avatar.Root>
			<div class="py-2">{user.name || user.email}</div>
		</div>
		<div class="grid gap-4 sm:grid-cols-2"></div>
	</Card>

	<Card class="mb-6" title={m.vivid_house_flea_zap()} description={m.wacky_key_vole_roam()}>
		<SettingsForm form={data.settingsForm} />
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
			{@render renderLabel('My current plan:')}
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
