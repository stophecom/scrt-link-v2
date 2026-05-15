<script lang="ts">
	import OrganizationCard from '../../organization-card.svelte';
	import OrganizationMembersCard from '../../organization-members-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<OrganizationMembersCard
	user={data.user}
	organization={data.orgWithMembers}
	orgSubscription={data.orgSubscription}
	organizationForm={data.organizationForm}
	inviteOrganizationMemberForm={data.inviteOrganizationMemberForm}
	manageOrganizationMemberForm={data.manageOrganizationMemberForm}
/>

<OrganizationCard
	organization={data.orgWithMembers}
	organizationForm={data.organizationForm}
	deleteOrganizationForm={data.deleteOrganizationForm}
/>
