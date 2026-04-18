<script lang="ts">
	import {
		encryptResponseContent,
		generateAESKey,
		importPublicKeyJWK,
		wrapAESKeyWithRSA
	} from '@scrt-link/core';
	import { onMount } from 'svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	import Textarea from '$lib/components/forms/form-fields/textarea.svelte';
	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages.js';
	import {
		type SecretResponseFormSchema,
		secretResponseFormSchema
	} from '$lib/validators/formSchemas';

	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<SecretResponseFormSchema>;
		publicKeyJWK: string;
		requestIdHash: string;
		successMessage?: string;
	};

	let {
		form: formProp,
		publicKeyJWK,
		requestIdHash,
		successMessage = $bindable('')
	}: Props = $props();

	let responseText = $state('');

	const sForm = superForm(formProp, {
		validators: zod4(secretResponseFormSchema()),
		dataType: 'json',
		applyAction: false,

		onSubmit: async ({ jsonData, cancel }) => {
			if (!responseText.trim()) {
				$message = {
					status: 'error',
					title: 'Error',
					description: 'Please enter your response.'
				};
				cancel();
				return;
			}

			try {
				// Import the RSA public key
				const rsaPublicKey = await importPublicKeyJWK(publicKeyJWK);

				// Generate a random AES key for this response
				const aesKey = await generateAESKey();

				// Encrypt the response content with AES
				$formData.encryptedResponseContent = await encryptResponseContent(responseText, aesKey);

				// Wrap the AES key with the RSA public key
				$formData.wrappedResponseKey = await wrapAESKeyWithRSA(aesKey, rsaPublicKey);

				// Encrypt metadata with the same AES key
				$formData.encryptedResponseMeta = await encryptResponseContent(
					JSON.stringify({ type: 'text' }),
					aesKey
				);

				jsonData($formData);
			} catch {
				$message = {
					status: 'error',
					title: 'Encryption failed',
					description: 'Could not encrypt your response. Please reload and try again.'
				};
				cancel();
			}
		},

		onResult({ result }) {
			if (result.type === 'success' || result.type === 'redirect') {
				successMessage =
					result.type === 'success' ? (result.data?.form?.message?.description ?? '') : '';
			}
			if (result.type === 'failure') {
				const msg = result.data?.form?.message;
				if (msg) {
					$message = msg;
				}
			}
		},

		onError({ result }) {
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'Something went wrong'
			};
		}
	});

	const { form: formData, message, delayed, enhance } = sForm;

	onMount(() => {
		$formData.requestIdHash = requestIdHash;
	});
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance class="space-y-6">
		<Form.Field form={sForm} name="encryptedResponseContent">
			<Textarea
				bind:value={responseText}
				data-testid="input-response-content"
				label={m.neat_shy_mole_type()}
				placeholder={m.pale_soft_wren_hint()}
				rows={6}
			/>
		</Form.Field>

		<Form.Button delayed={$delayed} data-testid="submit-response"
			>{m.bold_true_ram_send()}</Form.Button
		>
	</form>
</FormWrapper>
