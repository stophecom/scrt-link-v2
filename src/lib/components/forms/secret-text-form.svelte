<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import * as m from '$lib/paraglide/messages.js';
	import { type SecretTextFormSchema, secretTextFormSchema } from '$lib/validators/formSchemas';
	import { createHash, encryptString, generateRandomUrlSafeString } from '$lib/web-crypto';

	import Input from '../ui/input/input.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import FormWrapper from './form-wrapper.svelte';

	let { data }: SuperValidated<Infer<SecretTextFormSchema>> = $props();

	let masterKey = $state('');
	const form = superForm(data, {
		validators: zodClient(secretTextFormSchema()),
		validationMethod: 'auto',
		dataType: 'json',

		onSubmit: async ({ jsonData }) => {
			const { text, password } = $formData;

			// Encrypt secret text before submitting
			masterKey = generateRandomUrlSafeString();

			let encryptedText = text;
			if (password) {
				encryptedText = await encryptString(encryptedText, password);
			}
			encryptedText = await encryptString(encryptedText, masterKey);

			// Set data to be posted
			const jsonPayload = {
				secretIdHash: await createHash(masterKey),
				meta: 'type=text',
				text: encryptedText,
				password: $formData.password
			};

			jsonData(jsonPayload);
		},

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

<h1>{masterKey}</h1>
<FormWrapper message={$message}>
	<form method="POST" use:enhance>
		<Form.Field {form} name="text" class="py-2">
			<Form.Control>
				<Form.Label class="sr-only">{m.mellow_lime_squid_urge()}</Form.Label>
				<div class="relative">
					<Textarea
						class="resize-none"
						bind:value={$formData.text}
						{...$constraints.text}
						placeholder="What is your secret?"
					/>
					<span class="absolute bottom-1 right-1 text-xs text-muted-foreground">123</span>
				</div>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>{m.yummy_fair_gazelle_link()}</Form.Label>
				<Input
					type="password"
					{...attrs}
					bind:value={$formData.password}
					{...$constraints.password}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="py-4">
			<Form.Button delayed={$delayed} class="w-full" size="lg">Submit</Form.Button>
		</div>
	</form>
	<SuperDebug data={$formData} />
</FormWrapper>
