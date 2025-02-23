<script lang="ts">
	import { enhance } from '$app/forms';
	import SettingsForm from '$lib/components/forms/settings-form.svelte';
	import CreateSecret from '$lib/components/layout/create-secret.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import * as m from '$lib/paraglide/messages.js';

	import type { LayoutServerData } from '../../$types';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData & LayoutServerData } = $props();
</script>

<Page
	title={m.zany_jolly_cuckoo_scoop({ name: data.user.name || m.quiet_long_beaver_scold() })}
	lead="Welcome back to your safe space."
>
	<div class="grid gap-2">
		<CreateSecret form={data.secretForm} user={data.user} baseUrl={data.baseUrl} />

		<Card title="Settings">
			<SettingsForm form={data.settingsForm} user={data.user} />
		</Card>

		<div>
			<Button variant="outline" href="/set-password">Change password</Button>
		</div>
		<form method="post" action="?/logout" use:enhance>
			<Button type="submit" variant="outline">Sign out</Button>
		</form>
	</div>
</Page>
