<script lang="ts">
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
