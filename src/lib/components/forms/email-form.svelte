<script lang="ts">
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages.js';
	import { type EmailFormSchema, emailFormSchema } from '$lib/validators/formSchemas';

	import Button from '../ui/button/button.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import FormWrapper from './form-wrapper.svelte';

	export let data: SuperValidated<Infer<EmailFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(emailFormSchema()),
		validationMethod: 'auto',
		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				type: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'Some error'
			};
		}
	});

	const { form: formData, message, delayed, constraints, enhance } = form;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance>
		<Form.Field {form} name="email" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>{m.clear_lost_goose_beam()}</Form.Label>
				<Input {...attrs} bind:value={$formData.email} {...$constraints.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="py-4">
			<Form.Button delayed={$delayed} class="w-full" size="lg">Continue with email</Form.Button>
		</div>
	</form>
	<div class="py-5">
		<Separator />
	</div>
	<Button class="w-full" variant="outline" href="/login/google">Sign up with Google</Button>
</FormWrapper>
