<script lang="ts">
	import LogOut from '@lucide/svelte/icons/log-out';

	import PageTitle from '$lib/components/blocks/page-title.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import AccountCard from '../../../../../(app)/(default)/account/account-card.svelte';
	import type { LayoutData } from '../$types';
	import type { PageData } from './$types';

	let { data }: { data: PageData & LayoutData } = $props();
</script>

<PageTitle title={m.super_flaky_wallaby_pick()} />

<AccountCard user={data.user} form={data.userForm} />

<form class="flex justify-center" method="post" action="?/logout">
	<Button type="submit" variant="outline"
		><LogOut class="me-2 h-4 w-4" />{m.wacky_big_raven_honor()}</Button
	>
</form>
