<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import { Role } from '$lib/data/enums';
	import { localizeHref } from '$lib/paraglide/runtime';

	import AccountCard from '../account-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { user } = data;
	const isAdminFlag = $derived(user?.role === Role.ADMIN);
</script>

{#if isAdminFlag}
	<Card class="mb-6" title="Admin">
		<Button variant="outline" class="me-2 mb-6" href={localizeHref('/admin')}>Admin Panel</Button>
		<Button variant="outline" class="mb-6" href={localizeHref('/admin/email-previews')}
			>Email Previews</Button
		>
	</Card>
{/if}

<AccountCard {user} form={data.userForm} />
