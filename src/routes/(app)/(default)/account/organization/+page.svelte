<script lang="ts">
	import OrganizationMembersCard from '../organization-members-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<!-- Shown only when the user has no organizations yet (server redirects otherwise) -->
<OrganizationMembersCard
	user={data.user}
	organization={null}
	organizationForm={data.organizationForm}
/>
