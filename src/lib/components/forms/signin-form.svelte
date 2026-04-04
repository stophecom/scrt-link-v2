<script lang="ts">
	import { derivePDK, unwrapMasterKey } from '@scrt-link/core';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { setMasterKey } from '$lib/client/key-manager';
	import { setPendingPassword } from '$lib/client/pending-password';
	import Password from '$lib/components/forms/form-fields/password.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Link from '$lib/components/ui/link';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { type SignInFormSchema, signInFormSchema } from '$lib/validators/formSchemas';

	import FormWrapper from './form-wrapper.svelte';

	export let data: SuperValidated<Infer<SignInFormSchema>>;

	const form = superForm(data, {
		validators: zod4Client(signInFormSchema()),
		validationMethod: 'auto',

		onResult: async ({ result }) => {
			if (result.type === 'success' && result.data?.redirect) {
				const redirect = result.data.redirect as string;

				if (result.data.keyStore) {
					// Encryption enabled: derive PDK, unwrap MK, then navigate
					try {
						console.log('formdata', $formData.password);
						console.log('pdk', result.data.keyStore);
						const { pdkSalt, pdkIterations, encryptedMasterKey } = result.data.keyStore;
						const pdk = await derivePDK($formData.password, pdkSalt, pdkIterations);
						const masterKey = await unwrapMasterKey(encryptedMasterKey, pdk);
						setMasterKey(masterKey);
					} catch (e) {
						console.error('Failed to unlock encryption keys:', e);
						$message = {
							status: 'error',
							title: 'Decryption failed',
							description: 'Could not unlock encryption keys. Try resetting your password.'
						};
						return;
					}
				} else {
					// Encryption not set up: store password for encryption setup page
					setPendingPassword($formData.password);
				}

				goto(redirect);
			}
		},

		onError({ result }) {
			$message = {
				status: 'error',
				title: 'Unknown error',
				description: result.error.message
			};
		}
	});

	const { form: formData, message, delayed, constraints, enhance } = form;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/loginWithPassword">
		<Form.Field {form} name="email" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>{m.clear_lost_goose_beam()}</Form.Label>
				<Input
					{...attrs}
					bind:value={$formData.email}
					{...$constraints.email}
					autocomplete="username"
					type="email"
					data-testid="input-email"
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password" class="py-4">
			<Password
				bind:value={$formData.password}
				{...$constraints.password}
				autocomplete="current-password"
				data-testid="input-password"
			/>

			<Form.Description
				><Link class="text-xs" href={localizeHref('/reset-password')}
					>{m.less_free_osprey_buzz()}</Link
				></Form.Description
			>
		</Form.Field>

		<div class="py-4">
			<Form.Button delayed={$delayed} class="flex w-full" size="lg" data-testid="submit-login"
				>{m.legal_weak_jay_bless()}</Form.Button
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
