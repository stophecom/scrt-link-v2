<script lang="ts">
	import { Pen } from '@lucide/svelte';
	import type { SuperValidated } from 'sveltekit-superforms';

	import { wait } from '$lib/client/utils';
	import InviteOrganizationMemberForm from '$lib/components/forms/invite-organization-member-form.svelte';
	import ManageOrganizationMemberForm from '$lib/components/forms/manage-organization-member-form.svelte';
	import OrganizationForm from '$lib/components/forms/organization-form.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import { InviteStatus, MembershipRole } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';
	import type { MembersAndInvitesByOrganization } from '$lib/server/organization';
	import type {
		InviteOrganizationMemberFormSchema,
		ManageOrganizationMemberFormSchema,
		OrganizationFormSchema
	} from '$lib/validators/formSchemas';

	import type { PageServerData } from './$types';

	let {
		organizationForm,
		inviteOrganizationMemberForm,
		manageOrganizationMemberForm,
		organization
	}: {
		user: App.Locals['user'];
		organization: PageServerData['userOrganization'];
		organizationForm: SuperValidated<OrganizationFormSchema>;
		inviteOrganizationMemberForm: SuperValidated<InviteOrganizationMemberFormSchema>;
		manageOrganizationMemberForm: SuperValidated<ManageOrganizationMemberFormSchema>;
	} = $props();

	let openDialogName = $state(false);
	let openDialogInvite = $state(false);

	let selectedItem: MembersAndInvitesByOrganization | null = $state(null);
</script>

{#snippet renderStatus(status: InviteStatus | null)}
	{#if status === InviteStatus.PENDING}
		<span class="italic">{m.aloof_male_shark_sail()}</span>
	{:else if status === InviteStatus.REVOKED}
		<span class="text-destructive">{m.warm_long_gecko_express()}</span>
	{:else if status === InviteStatus.EXPIRED}
		<span class="text-destructive">{m.flaky_tiny_weasel_stab()}</span>
	{:else}
		<span class="text-success">{'active'}</span>
	{/if}
{/snippet}

{#snippet renderUserCard(email: string, name: string | null, picture: string | null)}
	{@const memberName = name || m.witty_wise_grebe_empower()}
	<div class="flex items-center font-medium">
		<div>
			<Avatar.Root class="me-2 h-8 w-8">
				<Avatar.Image src={picture} alt={memberName} />
				<Avatar.Fallback class="border-foreground bg-foreground text-background border uppercase"
					>{Array.from(email)[0]}</Avatar.Fallback
				>
			</Avatar.Root>
		</div>
		<div>
			{memberName}
			<div class="text-xs">{email}</div>
		</div>
	</div>
{/snippet}

{#if organization}
	<Card class="mb-6" title={organization.name} description={m.tense_witty_gecko_relish()}>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>{m.cuddly_flat_salmon_express()}</Table.Head>
					<Table.Head>{m.bad_close_anaconda_forgive()}</Table.Head>
					<Table.Head>{m.noisy_loved_chicken_forgive()}</Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each organization.members as member}
					<Table.Row>
						<Table.Cell>
							{@render renderUserCard(member.email, member.name, member.picture)}
						</Table.Cell>
						<Table.Cell>{member.role}</Table.Cell>
						<Table.Cell>{@render renderStatus(member.status)}</Table.Cell>
						<Table.Cell>
							{#if member.role !== MembershipRole.OWNER}
								<Button
									size="icon"
									variant="ghost"
									on:click={() => {
										selectedItem = member;
									}}
								>
									<Pen class="h-4 w-4" /><span class="sr-only">{m.helpful_noble_swan_mop()}</span>
								</Button>
							{/if}
						</Table.Cell>
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
							onSuccess={() => {
								wait(200).then(async () => {
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

	<Dialog.Root bind:open={selectedItem} on:openChange={(e) => !e.detail && close()}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				{#if selectedItem}
					<Dialog.Title>
						{#if selectedItem.userId}
							{m.still_royal_cod_flip()}
						{:else if selectedItem.inviteId}
							{m.bold_bold_pony_peel()}
						{/if}
					</Dialog.Title>
					<div class="pt-4">
						<dir class="mb-3 rounded border p-3">
							{@render renderUserCard(selectedItem.email, selectedItem.name, selectedItem.picture)}
						</dir>
						<ManageOrganizationMemberForm
							organizationId={organization.id}
							userId={selectedItem.userId}
							inviteId={selectedItem.inviteId}
							form={manageOrganizationMemberForm}
							formAction="?/removeMemberFromOrganization"
							onSuccess={() => {
								selectedItem = null;
							}}
						/>
					</div>
				{/if}
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Card class="mb-6" title={m.drab_dark_squirrel_fetch()} description={m.fresh_bad_midge_explore()}>
		<OrganizationForm form={organizationForm} formAction="?/createOrganization" />
	</Card>
{/if}
