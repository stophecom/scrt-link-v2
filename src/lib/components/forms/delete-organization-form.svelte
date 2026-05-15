<script lang="ts">
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import Switch from '$lib/components/forms/form-fields/switch.svelte';
	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages.js';
	import {
		type DeleteOrganizationSchema,
		deleteOrganizationSchema
	} from '$lib/validators/formSchemas';

	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<Infer<DeleteOrganizationSchema>>;
		onSuccess?: () => void;
	};

	let { form: formProp, onSuccess = () => {} }: Props = $props();

	const deleteOrgForm = superForm(formProp, {
		validators: zod4Client(deleteOrganizationSchema()),
		validationMethod: 'auto',
		onError(event) {
			$message = {
				status: 'error',
				title: `${event.result.status}`,
				description: event.result.error.message
			};
		},
		onUpdated: () => {
			onSuccess();
		}
	});

	const { form: formData, message, delayed, enhance } = deleteOrgForm;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/deleteOrganization">
		<Form.Field form={deleteOrgForm} name="confirm" class="py-4">
			<Switch bind:checked={$formData.confirm} label={m.flat_warm_org_delete_confirm()} />
		</Form.Field>

		<div class="py-4">
			<Form.Button variant="destructive" delayed={$delayed} class="w-full" size="lg"
				>{m.flat_warm_org_delete_btn()}</Form.Button
			>
		</div>

		<input type="hidden" name="organizationId" bind:value={$formData.organizationId} />
	</form>
</FormWrapper>
