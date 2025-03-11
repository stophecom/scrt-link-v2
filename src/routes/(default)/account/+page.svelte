<script lang="ts">
	import LogOut from 'lucide-svelte/icons/log-out';

	import DarkModeSwitcher from '$lib/components/elements/dark-mode-switcher.svelte';
	import SettingsForm from '$lib/components/forms/settings-form.svelte';
	import ThemeForm from '$lib/components/forms/theme-form.svelte';
	import Page from '$lib/components/page/page.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../$types';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData & LayoutServerData } = $props();

	const { user } = data;
</script>

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
		<div class="grid gap-4 sm:grid-cols-2">
			<form method="post" action="?/logout">
				<Button class="w-full" type="submit" variant="outline"
					><LogOut class="me-2 h-4 w-4" />{m.wacky_big_raven_honor()}</Button
				>
			</form>
		</div>
	</Card>

	<Card class="mb-6" title={m.vivid_house_flea_zap()} description={m.wacky_key_vole_roam()}>
		<SettingsForm form={data.settingsForm} user={data.user} />
	</Card>

	<Card class="mb-6" title="Appearance" description="Choose your favorite theme color.">
		<div class="mb-2">
			<ThemeForm form={data.themeForm} user={data.user} />
		</div>
		<DarkModeSwitcher variant="outline" />
	</Card>

	<Card title={m.novel_proud_anaconda_zoom()}>
		<div class="mb-2">
			<Button variant="outline" href="/set-password">{m.jumpy_factual_mole_hunt()}</Button>
		</div>
		<Button variant="outline" href="/delete-account" class="text-destructive"
			>{m.home_sharp_jackdaw_endure()}</Button
		>
	</Card>
</Page>
