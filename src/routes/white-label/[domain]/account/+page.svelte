<script lang="ts">
	import LogOut from 'lucide-svelte/icons/log-out';

	import DarkModeSwitcher from '$lib/components/elements/dark-mode-switcher.svelte';
	import SettingsForm from '$lib/components/forms/settings-form.svelte';
	import ThemeForm from '$lib/components/forms/theme-form.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import Container from '$lib/components/ui/container/container.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { m } from '$lib/paraglide/messages.js';

	import SecretsCard from '../../../(app)/(default)/account/secrets-card.svelte';
	import type { LayoutServerData } from '../../$types';
	import type { PageServerData } from './$types';
	import AccountCard from './account-card.svelte';

	let { data }: { data: PageServerData & LayoutServerData } = $props();

	const { user } = data;
</script>

<Page
	title={m.zany_jolly_cuckoo_scoop({
		name: data.userForm.data.name || m.quiet_long_beaver_scold()
	})}
	lead={m.gray_quiet_tern_bubble()}
>
	<Container>
		<Tabs.Root value="secrets">
			<Tabs.List class="mb-2">
				<Tabs.Trigger class="data-[state=active]:bg-muted" value="secrets"
					>{m.free_nimble_whale_fry()}</Tabs.Trigger
				>
				<Tabs.Trigger class="data-[state=active]:bg-muted" value="account"
					>{m.super_flaky_wallaby_pick()}</Tabs.Trigger
				>
			</Tabs.List>
			<Tabs.Content value="secrets">
				<SecretsCard secrets={data.secrets} secretForm={data.secretForm} user={data.user} />
			</Tabs.Content>
			<Tabs.Content value="account">
				<AccountCard {user} form={data.userForm} />

				<Card class="mb-6" title={m.vivid_house_flea_zap()} description={m.wacky_key_vole_roam()}>
					<SettingsForm {user} form={data.settingsForm} />
				</Card>

				<Card
					class="mb-6"
					title={m.shy_smug_crow_sing()}
					description={m.left_patchy_piranha_foster()}
				>
					<div class="mb-2">
						<ThemeForm form={data.themeForm} />
					</div>
					<DarkModeSwitcher variant="outline" />
				</Card>

				<form class="flex justify-center" method="post" action="?/logout">
					<Button type="submit" variant="outline"
						><LogOut class="me-2 h-4 w-4" />{m.wacky_big_raven_honor()}</Button
					>
				</form>
			</Tabs.Content>
		</Tabs.Root>
	</Container>
</Page>
