<script lang="ts">
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import * as m from '$lib/paraglide/messages.js';
	import { type SecretTextFormSchema, secretTextFormSchema } from '$lib/validators/formSchemas';

	import Textarea from '../ui/textarea/textarea.svelte';
	import FormWrapper from './form-wrapper.svelte';

	export let data: SuperValidated<Infer<SecretTextFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(secretTextFormSchema()),
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
		<Form.Field {form} name="text" class="py-2">
			<Form.Control let:attrs>
				<Form.Label class="sr-only">{m.mellow_lime_squid_urge()}</Form.Label>
				<div class="relative">
					<Textarea
						class="resize-none"
						{...attrs}
						bind:value={$formData.text}
						{...$constraints.text}
						placeholder="What is your secret?"
					/>
					<span class="absolute bottom-1 right-1 text-xs text-muted-foreground">123</span>
				</div>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="py-4">
			<Form.Button delayed={$delayed} class="w-full" size="lg">Submit</Form.Button>
		</div>
	</form>
</FormWrapper>
