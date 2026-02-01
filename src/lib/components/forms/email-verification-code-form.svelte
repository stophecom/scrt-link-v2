<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { m } from '$lib/paraglide/messages.js';
	import {
		type EmailFormSchema,
		type EmailVerificationCodeFormSchema,
		emailVerificationCodeFormSchema
	} from '$lib/validators/formSchemas';

	import Button from '../ui/button/button.svelte';
	import FormWrapper from './form-wrapper.svelte';

	export let verificationFormData: SuperValidated<Infer<EmailVerificationCodeFormSchema>>;
	export let resendFormData: SuperValidated<EmailFormSchema>;

	const verificationForm = superForm(verificationFormData, {
		validators: zod4Client(emailVerificationCodeFormSchema()),
		validationMethod: 'auto',
		onError(event) {
			$verificationFormMessage = {
				status: 'error',
				title: `${event.result.status}`,
				description: event.result.error.message
			};
		}
	});

	const {
		form: formData,
		message: verificationFormMessage,
		constraints,
		delayed: verificationFormDelayed,
		enhance
	} = verificationForm;

	const {
		message: resendFormMessage,
		delayed: resendFormDelayed,
		enhance: enhanceResendForm
	} = superForm(resendFormData, {
		onError(event) {
			$resendFormMessage = {
				status: 'error',
				title: `${event.result.status}`,
				description: event.result.error.message
			};
		}
	});
</script>

<FormWrapper message={$verificationFormMessage || $resendFormMessage}>
	<form method="POST" action="?/verifyEmailVerificationCode" use:enhance>
		<Form.Field form={verificationForm} name="code" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>{m.few_lime_kudu_imagine()}</Form.Label>
				<Input {...attrs} bind:value={$formData.code} {...$constraints.code} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<input name="email" type="hidden" bind:value={$formData.email} />

		<div class="py-4">
			<Form.Button delayed={$verificationFormDelayed} class="w-full" size="lg"
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

	<form method="POST" action="?/resend" use:enhanceResendForm>
		<input type="hidden" name="email" value={$formData.email} />
		<div class="py-4">
			<Button type="submit" delayed={$resendFormDelayed} variant="outline"
				>{m.shy_dizzy_jay_embrace()}</Button
			>
		</div>
	</form>
</FormWrapper>
