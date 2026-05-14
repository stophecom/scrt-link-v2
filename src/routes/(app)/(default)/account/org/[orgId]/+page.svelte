<script lang="ts">
	import OrganizationCard from '../../organization-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<OrganizationCard
	user={data.user}
	organization={data.orgWithMembers}
	orgSubscription={data.orgSubscription}
	organizationForm={data.organizationForm}
	inviteOrganizationMemberForm={data.inviteOrganizationMemberForm}
	manageOrganizationMemberForm={data.manageOrganizationMemberForm}
/>
