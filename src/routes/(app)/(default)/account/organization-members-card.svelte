<script lang="ts">
	import { User } from '@lucide/svelte';
	import type { Stripe } from 'stripe';
	import type { SuperValidated } from 'sveltekit-superforms';

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

	let {
		user,
		organizationForm,
		inviteOrganizationMemberForm,
		manageOrganizationMemberForm,
		organization,
		orgSubscription = null
	}: {
		user: App.Locals['user'];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		organization: any;
		orgSubscription?: Stripe.Subscription | null;
		organizationForm: SuperValidated<OrganizationFormSchema>;
		inviteOrganizationMemberForm?: SuperValidated<InviteOrganizationMemberFormSchema>;
		manageOrganizationMemberForm?: SuperValidated<ManageOrganizationMemberFormSchema>;
	} = $props();

	let openDialogInvite = $state(false);
	let openDialogManage = $state(false);

	let selectedItem: MembersAndInvitesByOrganization | null = $state(null);

	$effect(() => {
		if (selectedItem) {
			openDialogManage = true;
		} else {
			openDialogManage = false;
		}
	});
</script>

{#snippet renderStatus(status: InviteStatus | null)}
	{#if status === InviteStatus.PENDING}
		<span class="italic">{m.aloof_male_shark_sail()}</span>
	{:else if status === InviteStatus.REVOKED}
		<span class="text-destructive">{m.warm_long_gecko_express()}</span>
	{:else if status === InviteStatus.EXPIRED}
		<span class="text-destructive">{m.flaky_tiny_weasel_stab()}</span>
	{:else}
		<span class="text-success">active</span>
	{/if}
{/snippet}

{#snippet renderUserCard(
	email: string,
	name: string | null,
	picture: string | null,
	isCurrentUser: boolean,
	isBillingContact: boolean
)}
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
			<div class="flex items-center gap-1.5 {isCurrentUser ? 'font-bold' : ''}">
				{memberName}
				{#if isCurrentUser}
					<User class="text-muted-foreground h-3.5 w-3.5" />
				{/if}
				{#if isBillingContact}
					<span
						class="bg-muted text-muted-foreground rounded-full px-1.5 py-px text-[10px] leading-none font-medium"
						>{m.flat_warm_bill_badge()}</span
					>
				{/if}
			</div>
			<div class="text-xs">{email}</div>
		</div>
	</div>
{/snippet}

{#if organization}
	<Card class="mb-6" title={m.flat_warm_org_members_title()}>
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
				{#each [...organization.members].sort( (a, b) => (a.userId === user?.id ? -1 : b.userId === user?.id ? 1 : 0) ) as member, i (i)}
					<Table.Row>
						<Table.Cell>
							{@render renderUserCard(
								member.email,
								member.name,
								member.picture,
								member.userId === user?.id,
								member.userId === organization.billingOwnerId
							)}
						</Table.Cell>
						<Table.Cell>{member.role}</Table.Cell>
						<Table.Cell>{@render renderStatus(member.status)}</Table.Cell>
						<Table.Cell class="text-right">
							{#if organization.role === MembershipRole.OWNER || organization.role === MembershipRole.ADMIN || member.userId === user?.id}
								<Button
									size="sm"
									variant="outline"
									onclick={() => {
										selectedItem = member;
									}}
								>
									{m.helpful_noble_swan_mop()}
								</Button>
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
			{#if (organization.role === MembershipRole.OWNER || organization.role === MembershipRole.ADMIN) && orgSubscription && ['active', 'trialing'].includes(orgSubscription.status)}
				{@const activeCount = Math.max(
					organization.members.filter((m: MembersAndInvitesByOrganization) => m.userId).length,
					1
				)}
				<Table.Caption class="mt-6 px-4 text-balance"
					>{m.glad_teal_fox_bill({ count: activeCount })}
				</Table.Caption>
			{/if}
		</Table.Root>

		{#if organization.role === MembershipRole.OWNER || organization.role === MembershipRole.ADMIN}
			<Separator class="my-6" />
			<Dialog.Root bind:open={openDialogInvite}>
				<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
					>{m.spare_lazy_jackal_slide()}</Dialog.Trigger
				>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>{m.mealy_few_mantis_absorb()}</Dialog.Title>
						<Dialog.Description>{m.mean_key_marmot_fall()}</Dialog.Description>
					</Dialog.Header>
					<InviteOrganizationMemberForm
						formAction="?/addMemberToOrganization"
						form={inviteOrganizationMemberForm!}
						organizationId={organization.id}
					/>
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</Card>

	<Dialog.Root
		bind:open={openDialogManage}
		onOpenChange={(isOpen) => {
			if (!isOpen) {
				selectedItem = null;
			}
		}}
	>
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
						<dir class="bg-card mb-3 rounded border p-3">
							{@render renderUserCard(
								selectedItem.email,
								selectedItem.name,
								selectedItem.picture,
								selectedItem.userId === user?.id,
								selectedItem.userId === organization.billingOwnerId
							)}
						</dir>
						<ManageOrganizationMemberForm
							organizationId={organization.id}
							userId={selectedItem.userId}
							inviteId={selectedItem.inviteId}
							isCurrentUser={selectedItem.userId === user?.id}
							isOwner={organization.role === MembershipRole.OWNER ||
								(organization.role === MembershipRole.ADMIN &&
									selectedItem?.role !== MembershipRole.OWNER)}
							isBillingContact={selectedItem.userId === organization.billingOwnerId}
							initialRole={selectedItem.role}
							form={manageOrganizationMemberForm!}
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
