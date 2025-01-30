<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import * as m from '$lib/paraglide/messages.js';
	import { type PasswordFormSchema, passwordFormSchema } from '$lib/validators/formSchemas';

	import Password from '../form-fields/password.svelte';
	import FormWrapper from './form-wrapper.svelte';

	export let form: SuperValidated<Infer<PasswordFormSchema>>;

	const passwordForm = superForm(form, {
		validators: zodClient(passwordFormSchema()),
		validationMethod: 'auto',
		onError(event) {
			$message = {
				status: 'error',
				title: `${event.result.status}`,
				description: event.result.error.message
			};
		}
	});

	const { form: formData, message, delayed, constraints, enhance } = passwordForm;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/setPassword">
		<Form.Field form={passwordForm} name="password" class="py-4">
			<Password
				bind:value={$formData.password}
				{...$constraints.password}
				autocomplete="new-password"
			/>
		</Form.Field>

		<div class="py-4">
			<Form.Button delayed={$delayed} class="w-full" size="lg"
				>{m.flat_moving_finch_assure()}</Form.Button
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
