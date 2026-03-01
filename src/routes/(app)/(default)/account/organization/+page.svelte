<script lang="ts">
	import PageTitle from '$lib/components/blocks/page-title.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import type { LayoutData } from '../$types';
	import OrganizationCard from '../organization-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData & LayoutData } = $props();
</script>

<PageTitle title={m.wild_inner_fox_honor()} />

<OrganizationCard
	user={data.user}
	organization={data.userOrganization}
	organizationForm={data.organizationForm}
	inviteOrganizationMemberForm={data.inviteOrganizationMemberForm}
	manageOrganizationMemberForm={data.manageOrganizationMemberForm}
/>
