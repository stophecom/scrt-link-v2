<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';

	import { wait } from '$lib/client/utils';
	import OrganizationForm from '$lib/components/forms/organization-form.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import { m } from '$lib/paraglide/messages.js';
	import type { OrganizationFormSchema } from '$lib/validators/formSchemas';

	import type { PageServerData } from './$types';

	let {
		form,
		organizations
	}: {
		user: App.Locals['user'];
		organizations: PageServerData['userOrganizations'];
		form: SuperValidated<OrganizationFormSchema>;
	} = $props();

	let open = $state(false);
</script>

<Card
	class="mb-6"
	title={'My Organization'}
	description={'With an organization you can manage private access to your secret service.'}
>
	{#if organizations.length}
		{#each organizations as organization}
			<div class="flex items-center py-1">
				<span class="me-2 text-xl"> {organization.name}</span>
				<Dialog.Root bind:open>
					(<Dialog.Trigger class="inline-block underline"
						>{m.aloof_such_mare_dance()}</Dialog.Trigger
					>)
					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>{m.spry_every_kangaroo_flip()}</Dialog.Title>
						</Dialog.Header>
						<OrganizationForm
							formAction="?/editOrganization"
							form={{ ...form, data: { name: organization.name, id: organization.id } }}
							onSubmit={() => {
								wait(300).then(async () => {
									open = false;
								});
							}}
						/>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		{/each}
	{:else}
		<OrganizationForm {form} formAction="?/createOrganization" />
	{/if}

	<Separator class="my-6" />

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>{'Member'}</Table.Head>
				<Table.Head>{'E-Mail'}</Table.Head>
				<Table.Head>{'Role'}</Table.Head>
				<Table.Head>{'Change'}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each organizations as org}
				<Table.Row>
					<Table.Cell class="font-medium"
						><span class="inline-block p-1 font-mono">{org.name}</span></Table.Cell
					>
					<Table.Cell>test</Table.Cell>

					<Table.Cell>test</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Card>
