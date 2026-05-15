<script lang="ts">
	import OrganizationForm from '$lib/components/forms/organization-form.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Card class="mb-6" title={m.drab_dark_squirrel_fetch()} description={m.fresh_bad_midge_explore()}>
	<OrganizationForm form={data.organizationForm} formAction="?/createOrganization" />
</Card>
