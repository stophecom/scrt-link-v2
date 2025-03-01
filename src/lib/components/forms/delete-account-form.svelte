<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import * as m from '$lib/paraglide/messages.js';
	import { type DeleteAccountSchema, deleteAccountSchema } from '$lib/validators/formSchemas';

	import Switch from '../form-fields/switch.svelte';
	import FormWrapper from './form-wrapper.svelte';

	export let form: SuperValidated<Infer<DeleteAccountSchema>>;

	const deleteAccountForm = superForm(form, {
		validators: zodClient(deleteAccountSchema()),
		validationMethod: 'auto',
		onError(event) {
			$message = {
				status: 'error',
				title: `${event.result.status}`,
				description: event.result.error.message
			};
		}
	});

	const { form: formData, message, delayed, enhance } = deleteAccountForm;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/deleteAccount">
		<Form.Field form={deleteAccountForm} name="confirm" class="py-4">
			<Switch bind:checked={$formData.confirm} label={m.inclusive_male_squirrel_treasure()} />
		</Form.Field>

		<div class="py-4">
			<Form.Button variant="destructive" delayed={$delayed} class="w-full" size="lg"
				>{m.home_sharp_jackdaw_endure()}</Form.Button
			>
		</div>

		<!-- For debugging -->
		{#if dev}
			<div class="py-3">
				<SuperDebug data={$formData} />
			</div>
		{/if}
	</form>
</FormWrapper>
