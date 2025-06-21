<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';

	import { wait } from '$lib/client/utils';
	import InviteOrganizationMemberForm from '$lib/components/forms/invite-organization-member-form.svelte';
	import OrganizationForm from '$lib/components/forms/organization-form.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { buttonVariants } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import { m } from '$lib/paraglide/messages.js';
	import type {
		InviteOrganizationMemberFormSchema,
		OrganizationFormSchema
	} from '$lib/validators/formSchemas';

	import type { PageServerData } from './$types';

	let {
		organizationForm,
		inviteOrganizationMemberForm,
		organization
	}: {
		user: App.Locals['user'];
		organization: PageServerData['userOrganization'];
		organizationForm: SuperValidated<OrganizationFormSchema>;
		inviteOrganizationMemberForm: SuperValidated<InviteOrganizationMemberFormSchema>;
	} = $props();

	let openDialogName = $state(false);
	let openDialogInvite = $state(false);
</script>

{#if organization}
	<Card class="mb-6" title={organization.name} description={m.tense_witty_gecko_relish()}>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>{m.cuddly_flat_salmon_express()}</Table.Head>
					<Table.Head>{m.bad_close_anaconda_forgive()}</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Edit</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each organization.members as member}
					<Table.Row>
						<Table.Cell class="flex items-center font-medium">
							<div>
								<Avatar.Root class="me-2 h-8 w-8">
									<Avatar.Image src={member.picture} alt={member.name} />
									<Avatar.Fallback
										class="border-foreground bg-foreground text-background border uppercase"
										>{Array.from(member.email)[0]}</Avatar.Fallback
									>
								</Avatar.Root>
							</div>
							<div>
								{member.name || m.witty_wise_grebe_empower()}
								<div class="text-xs">{member.email}</div>
							</div>
						</Table.Cell>
						<Table.Cell>{member.role}</Table.Cell>
						<Table.Cell>{'pending'}</Table.Cell>
						<Table.Cell>...</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>

		<Separator class="my-6" />
		<div class="xs:grid-rows-1 xs:grid-cols-2 grid grid-rows-2 gap-2">
			<div>
				<Dialog.Root bind:open={openDialogName}>
					<Dialog.Trigger class={buttonVariants({ variant: 'outline', class: 'max-xs:w-full' })}
						>{m.patchy_polite_wombat_bump()}</Dialog.Trigger
					>
					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>{m.spry_every_kangaroo_flip()}</Dialog.Title>
						</Dialog.Header>
						<OrganizationForm
							formAction="?/editOrganization"
							form={organizationForm}
							onSubmit={() => {
								wait(300).then(async () => {
									openDialogName = false;
								});
							}}
						/>
					</Dialog.Content>
				</Dialog.Root>
			</div>
			<div class="xs:ms-auto">
				<Dialog.Root bind:open={openDialogInvite}>
					<Dialog.Trigger class={buttonVariants({ variant: 'default', class: 'max-xs:w-full' })}
						>{m.spare_lazy_jackal_slide()}</Dialog.Trigger
					>
					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>{m.mealy_few_mantis_absorb()}</Dialog.Title>
						</Dialog.Header>
						<InviteOrganizationMemberForm
							formAction="?/addMemberToOrganization"
							form={inviteOrganizationMemberForm}
							organizationId={organization.id}
						/>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>
	</Card>
{:else}
	<Card class="mb-6" title={m.drab_dark_squirrel_fetch()} description={m.fresh_bad_midge_explore()}>
		<OrganizationForm form={organizationForm} formAction="?/createOrganization" />
	</Card>
{/if}
