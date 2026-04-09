<script lang="ts">
	import type { LayoutData } from '../$types';
	import AccountCard from '../account-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData & LayoutData } = $props();
</script>

<AccountCard user={data.user} form={data.userForm} organizationName={data.userOrganization?.name} />
