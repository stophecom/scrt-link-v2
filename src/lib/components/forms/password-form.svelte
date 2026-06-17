<script lang="ts">
	import { deriveAuthVerifier } from '@scrt-link/core';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { page } from '$app/state';
	import Password from '$lib/components/forms/form-fields/password.svelte';
	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages.js';
	import { type PasswordFormSchema, passwordFormSchema } from '$lib/validators/formSchemas';

	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<Infer<PasswordFormSchema>>;
		onSuccess?: (password: string) => void;
	};
	let { form, onSuccess }: Props = $props();

	let submittedPassword = '';

	const passwordForm = superForm(form, {
		validators: zod4Client(passwordFormSchema()),
		validationMethod: 'auto',
		// dataType json so we send the auth verifier, not the plaintext. A plain form submits
		// the DOM input value snapshotted before onSubmit runs, so mutating $formData there is
		// too late and the plaintext gets sent; jsonData lets us control the payload.
		dataType: 'json',
		applyAction: false,
		onSubmit: async ({ jsonData }) => {
			// Keep the plaintext locally (for encryption setup) but send only the verifier.
			submittedPassword = $formData.password;
			const verifier = await deriveAuthVerifier(submittedPassword, page.data.user?.email ?? '');
			jsonData({ password: verifier });
		},
		onUpdated({ form }) {
			if (form.message?.status === 'success') {
				onSuccess?.(submittedPassword);
			} else {
				// jsonData()/the server echo left the verifier in the field — restore the plaintext.
				$formData.password = submittedPassword;
			}
		},
		onError(event) {
			$formData.password = submittedPassword;
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
	</form>
</FormWrapper>
