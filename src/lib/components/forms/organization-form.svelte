<script lang="ts">
	import { type FormOptions, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages.js';
	import { type OrganizationFormSchema, organizationFormSchema } from '$lib/validators/formSchemas';

	import Text from './form-fields/text.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<OrganizationFormSchema>;
		onSubmit?: FormOptions['onSubmit'];
		formAction: string;
	};

	let { form: formProp, formAction, onSubmit = $bindable() }: Props = $props();

	const form = superForm(formProp, {
		validators: zodClient(organizationFormSchema()),
		// We prioritize data returned from the load function
		// https://superforms.rocks/concepts/enhance#optimistic-updates
		invalidateAll: 'force',
		onSubmit: onSubmit,
		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'No further information available.'
			};
		}
	});

	const { form: formData, message, enhance, constraints, delayed } = form;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action={formAction}>
		<Form.Field {form} name="name" class="mb-2">
			<Text
				label={m.crazy_solid_cow_cuddle()}
				bind:value={$formData.name}
				{...$constraints.name}
				type="text"
			/>
		</Form.Field>
		<input type="hidden" name="organizationId" value={$formData.id} />

		<Form.Button delayed={$delayed} class="ml-auto ">{m.caring_light_tiger_taste()}</Form.Button>
	</form>
</FormWrapper>
