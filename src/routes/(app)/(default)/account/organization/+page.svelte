<script lang="ts">
	import OrganizationCard from '../organization-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<!-- Shown only when the user has no organizations yet (server redirects otherwise) -->
<OrganizationCard user={data.user} organization={null} organizationForm={data.organizationForm} />
