<script lang="ts">
	import PageTitle from '$lib/components/blocks/page-title.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import AccountCard from '../../../../../(app)/(default)/account/account-card.svelte';
	import type { LayoutData } from '../$types';
	import type { PageData } from './$types';

	let { data }: { data: PageData & LayoutData } = $props();
</script>

<PageTitle title={m.super_flaky_wallaby_pick()} />

<AccountCard user={data.user} form={data.userForm} />
