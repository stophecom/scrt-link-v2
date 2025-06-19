<script lang="ts">
	import LogOut from 'lucide-svelte/icons/log-out';
	import { mode } from 'mode-watcher';

	import WhiteLabelPage from '$lib/components/page/white-label-page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { m } from '$lib/paraglide/messages.js';

	import SecretsCard from '../../../(app)/(default)/account/secrets-card.svelte';
	import type { PageData } from './$types';
	import AccountCard from './account-card.svelte';

	let { data }: { data: PageData } = $props();

	const { user } = data;
	let logo = $derived(mode.current === 'dark' ? data.logoDarkMode : data.logo);
</script>

<WhiteLabelPage
	metaTitle="Account"
	{logo}
	title={m.zany_jolly_cuckoo_scoop({
		name: data.userForm.data.name || m.quiet_long_beaver_scold()
	})}
	lead={m.gray_quiet_tern_bubble()}
>
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

			<form class="flex justify-center" method="post" action="?/logout">
				<Button type="submit" variant="outline"
					><LogOut class="me-2 h-4 w-4" />{m.wacky_big_raven_honor()}</Button
				>
			</form>
		</Tabs.Content>
	</Tabs.Root>
</WhiteLabelPage>
