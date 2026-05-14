<script lang="ts">
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';

	import { wait } from '$lib/client/utils';
	import DeleteOrganizationForm from '$lib/components/forms/delete-organization-form.svelte';
	import OrganizationForm from '$lib/components/forms/organization-form.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator';
	import { MembershipRole } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';
	import type { MembersAndInvitesByOrganization } from '$lib/server/organization';
	import type {
		DeleteOrganizationSchema,
		OrganizationFormSchema
	} from '$lib/validators/formSchemas';

	type Props = {
		organization: {
			id: string;
			name: string;
			role: MembershipRole | null;
			members: MembersAndInvitesByOrganization[];
		};
		organizationForm: SuperValidated<OrganizationFormSchema>;
		deleteOrganizationForm: SuperValidated<Infer<DeleteOrganizationSchema>>;
	};

	let { organization, organizationForm, deleteOrganizationForm }: Props = $props();

	let openDialogEdit = $state(false);
	let openDialogDelete = $state(false);

	const isOwner = $derived(organization.role === MembershipRole.OWNER);
	const memberCount = $derived(
		organization.members.filter((m: MembersAndInvitesByOrganization) => m.userId !== null).length
	);
</script>

{#snippet renderLabel(label: string)}
	<span class="inline-block p-1 font-medium">{label}</span>
{/snippet}

<Card class="mb-6" title={m.flat_warm_org_title()}>
	<div class="flex items-center py-1">
		{@render renderLabel('Name:')}
		{organization.name}
		{#if isOwner}
			<Dialog.Root bind:open={openDialogEdit}>
				(<Dialog.Trigger class="inline-block underline">{m.aloof_such_mare_dance()}</Dialog.Trigger
				>)
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>{m.patchy_polite_wombat_bump()}</Dialog.Title>
					</Dialog.Header>
					<OrganizationForm
						formAction="?/editOrganization"
						form={organizationForm}
						onSuccess={() => {
							wait(200).then(() => {
								openDialogEdit = false;
							});
						}}
					/>
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</div>

	<div class="flex py-1">
		{@render renderLabel(m.flat_warm_org_members_count() + ':')}
		<span class="inline-block p-1">{memberCount}</span>
	</div>

	{#if isOwner}
		<Separator class="my-6" />
		<div class="flex flex-wrap">
			<Dialog.Root bind:open={openDialogDelete}>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline', class: 'text-destructive' })}>
					{m.flat_warm_org_delete_btn()}
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>{m.flat_warm_org_delete_title()}</Dialog.Title>
						<Dialog.Description>{m.flat_warm_org_delete_desc()}</Dialog.Description>
					</Dialog.Header>
					<DeleteOrganizationForm
						form={deleteOrganizationForm}
						onSuccess={() => {
							openDialogDelete = false;
						}}
					/>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{/if}
</Card>
