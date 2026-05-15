<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import Select from '$lib/components/forms/form-fields/select.svelte';
	import FormWrapper from '$lib/components/forms/form-wrapper.svelte';
	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages.js';
	import {
		type UpdateBillingOwnerSchema,
		updateBillingOwnerSchema
	} from '$lib/validators/formSchemas';

	type Member = { userId: string; name: string | null; email: string };

	type Props = {
		form: SuperValidated<UpdateBillingOwnerSchema>;
		members: Member[];
	};

	let { form: formProp, members }: Props = $props();

	const form = superForm(formProp, {
		validators: zod4Client(updateBillingOwnerSchema()),
		invalidateAll: 'force'
	});

	const { form: formData, message, delayed, enhance } = form;

	const memberOptions = $derived(
		members.map((member) => ({
			value: member.userId,
			label: member.name ? `${member.name} (${member.email})` : member.email
		}))
	);
</script>

<FormWrapper message={$message}>
	<form method="POST" action="?/updateOrganizationBillingOwner" use:enhance>
		<div class="flex flex-wrap items-end gap-3">
			<Form.Field {form} name="billingOwnerId" class="pb-0">
				<Select
					label={m.flat_warm_bill_contact()}
					options={memberOptions}
					bind:value={$formData.billingOwnerId}
				/>
			</Form.Field>
			<input type="hidden" name="billingOwnerId" bind:value={$formData.billingOwnerId} />
			<input type="hidden" name="organizationId" bind:value={$formData.organizationId} />
			<Form.Button delayed={$delayed} class="mt-6" variant="outline"
				>{m.caring_light_tiger_taste()}</Form.Button
			>
		</div>
	</form>
</FormWrapper>
