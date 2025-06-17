<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';

	import { wait } from '$lib/client/utils';
	import OrganizationForm from '$lib/components/forms/organization-form.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import { m } from '$lib/paraglide/messages.js';
	import type { OrganizationFormSchema } from '$lib/validators/formSchemas';

	import type { PageServerData } from './$types';

	let {
		form,
		organization
	}: {
		user: App.Locals['user'];
		organization: PageServerData['userOrganization'];
		form: SuperValidated<OrganizationFormSchema>;
	} = $props();

	let open = $state(false);
</script>

{#if organization}
	<Card class="mb-6" title={organization.name} description={'Manage your organization.'}>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>{'Member'}</Table.Head>
					<Table.Head>{'E-Mail'}</Table.Head>
					<Table.Head>{'Role'}</Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each organization.members as member}
					<Table.Row>
						<Table.Cell class="font-medium">{member.name || 'Anonymous'}</Table.Cell>
						<Table.Cell>{member.email}</Table.Cell>
						<Table.Cell>{member.role}</Table.Cell>

						<Table.Cell></Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>

		<Separator class="my-6" />
		<Dialog.Root bind:open>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}
				>{'Edit organization'}</Dialog.Trigger
			>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>{m.spry_every_kangaroo_flip()}</Dialog.Title>
				</Dialog.Header>
				<OrganizationForm
					formAction="?/editOrganization"
					{form}
					onSubmit={() => {
						wait(300).then(async () => {
							open = false;
						});
					}}
				/>
			</Dialog.Content>
		</Dialog.Root>
	</Card>
{:else}
	<Card
		class="mb-6"
		title={'My Organization'}
		description={'With an organization you can manage private access to your secret service.'}
	>
		<OrganizationForm {form} formAction="?/createOrganization" />
	</Card>
{/if}
