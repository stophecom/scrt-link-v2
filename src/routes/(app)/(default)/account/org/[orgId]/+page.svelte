<script lang="ts">
	import FileSignature from '@lucide/svelte/icons/file-signature';

	import { buttonVariants } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

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

<Card class="mb-6" title={m.dpa_card_title()}>
	<p class="text-muted-foreground mb-4 text-sm">{m.dpa_card_description()}</p>
	<a
		href={localizeHref(`/account/org/${data.orgWithMembers.id}/dpa`)}
		class={buttonVariants({ variant: 'outline' })}
	>
		<FileSignature class="mr-2 size-4" />
		{m.dpa_card_cta()}
	</a>
</Card>
