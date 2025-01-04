<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages.js';
	import {
		type CodeFormSchema,
		codeFormSchema,
		type EmailFormSchema
	} from '$lib/validators/formSchemas';

	import Button from '../ui/button/button.svelte';
	import FormWrapper from './form-wrapper.svelte';

	export let verificationFormData: SuperValidated<Infer<CodeFormSchema>>;
	export let resendFormData: SuperValidated<Infer<EmailFormSchema>>;

	const verificationForm = superForm(verificationFormData, {
		validators: zodClient(codeFormSchema),
		validationMethod: 'auto'
	});

	const {
		form: formData,
		message: verificationFormMessage,
		constraints,
		enhance
	} = verificationForm;

	const { message: resendFormMessage } = superForm(resendFormData);
</script>

<FormWrapper message={$verificationFormMessage || $resendFormMessage}>
	<form method="POST" action="?/verifyCode" use:enhance>
		<Form.Field form={verificationForm} name="code" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>{m.few_lime_kudu_imagine()}</Form.Label>
				<Input {...attrs} bind:value={$formData.code} {...$constraints.code} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<input name="email" type="hidden" bind:value={$formData.email} />

		<div class="py-4">
			<Form.Button size="lg">Submit</Form.Button>
		</div>

		<!-- For debugging -->
		{#if dev}
			<div class="py-3">
				<SuperDebug data={$formData} />
			</div>
		{/if}
	</form>

	<form method="POST" action="?/resend">
		<input type="hidden" name="email" value={$formData.email} />
		<div class="py-4">
			<Button type="submit" size="lg">Send code again</Button>
		</div>
	</form>
</FormWrapper>
