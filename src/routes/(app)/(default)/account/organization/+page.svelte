<script lang="ts">
	import type { LayoutData } from '../$types';
	import OrganizationCard from '../organization-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData & LayoutData } = $props();
</script>

<OrganizationCard
	user={data.user}
	organization={data.userOrganization}
	orgSubscription={data.orgSubscription}
	organizationForm={data.organizationForm}
	inviteOrganizationMemberForm={data.inviteOrganizationMemberForm}
	manageOrganizationMemberForm={data.manageOrganizationMemberForm}
/>
