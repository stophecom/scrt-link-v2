<script lang="ts">
	import { deriveAuthVerifier, derivePDK, unwrapMasterKey } from '@scrt-link/core';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { goto } from '$app/navigation';
	import { setMasterKey } from '$lib/client/key-manager';
	import { setPendingPassword } from '$lib/client/pending-password';
	import Password from '$lib/components/forms/form-fields/password.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Link from '$lib/components/ui/link';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { stripPattern } from '$lib/utils';
	import { type SignInFormSchema, signInFormSchema } from '$lib/validators/formSchemas';

	import FormWrapper from './form-wrapper.svelte';

	export let data: SuperValidated<Infer<SignInFormSchema>>;

	let formEl: HTMLFormElement;
	// True while resubmitting a legacy (authVersion 1) account with its plaintext password
	// so the server can verify the old hash once and re-key it to the zero-knowledge scheme.
	let migrating = false;
	// The plaintext password, captured before jsonData() overwrites $formData.password with
	// the verifier. Reused for the migration retry and for PDK derivation in onResult.
	let capturedPassword = '';

	const form = superForm(data, {
		validators: zod4Client(signInFormSchema()),
		validationMethod: 'auto',
		dataType: 'json',
		applyAction: false,
		// Keep the entered password across submits: superforms' default resetForm clears it
		// after the `needsLegacyMigration` response, but the migration retry (and PDK
		// derivation for encryption unlock) reads it from $formData afterwards.
		resetForm: false,

		onSubmit: async ({ jsonData, cancel }) => {
			try {
				// Capture the plaintext on the first attempt — jsonData() below overwrites
				// $formData.password with the verifier, so the migration retry must not re-read
				// it from $formData. Send the verifier in place of the plaintext password.
				if (!migrating) {
					capturedPassword = $formData.password;
				}
				const verifier = await deriveAuthVerifier(capturedPassword, $formData.email);
				const payload: Record<string, string> = {
					email: $formData.email,
					password: verifier
				};
				if (migrating) {
					payload.legacyPassword = capturedPassword;
				}
				jsonData(payload);
			} catch (e) {
				console.error('Failed to derive auth verifier:', e);
				$message = {
					status: 'error',
					title: m.mad_such_albatross_cherish(),
					description: m.slim_fair_owl_peek()
				};
				cancel();
			}
		},

		onResult: async ({ result }) => {
			// Legacy account: server asks for a one-time plaintext resubmit to migrate.
			if (result.type === 'success' && result.data?.needsLegacyMigration && !migrating) {
				migrating = true;
				// Resubmit only once the current submission fully settles. superforms keeps
				// `submitting` true until `completed()` runs — and with the default
				// `invalidateAll: true` that happens *after* an `await invalidateAll()`, so a
				// naive setTimeout still races and the default `multipleSubmits: 'prevent'`
				// silently cancels the resubmit. Waiting for `submitting` to flip to false is
				// the race-free trigger.
				const unsub = submitting.subscribe((isSubmitting) => {
					if (isSubmitting) return;
					unsub();
					formEl.requestSubmit();
				});
				return;
			}
			migrating = false;

			if (result.type === 'success' && result.data?.redirect) {
				const redirect = result.data.redirect as string;

				if (result.data.keyStore) {
					// Encryption enabled: derive PDK, unwrap MK, then navigate
					try {
						const userId = result.data.userId;
						if (typeof userId !== 'string') {
							throw new Error('Login response missing userId');
						}
						const { pdkSalt, pdkIterations, encryptedMasterKey } = result.data.keyStore;
						const pdk = await derivePDK(capturedPassword, pdkSalt, pdkIterations);
						const masterKey = await unwrapMasterKey(encryptedMasterKey, pdk);
						setMasterKey(userId, masterKey);
					} catch (e) {
						console.error('Failed to unlock encryption keys:', e);
						$message = {
							status: 'error',
							title: m.mad_such_albatross_cherish(),
							description: m.slim_fair_owl_peek()
						};
						return;
					}
				} else {
					// Encryption not set up: store password for encryption setup page
					setPendingPassword(capturedPassword);
				}

				goto(localizeHref(redirect));
			}
		},

		onUpdated() {
			// superforms applies the server's echoed form to $formData *after* onResult, leaving
			// the verifier in the password field. Restore the plaintext here (runs after that
			// update): on failure the user sees their input rather than a 64-char hash, and during
			// migration the field stays valid for the auto-resubmit (which uses capturedPassword).
			$formData.password = capturedPassword;
		},

		onError({ result }) {
			$formData.password = capturedPassword;
			$message = {
				status: 'error',
				title: 'Unknown error',
				description: result.error.message
			};
		}
	});

	const { form: formData, message, delayed, submitting, constraints, enhance } = form;
</script>

<FormWrapper message={$message}>
	<form bind:this={formEl} method="POST" use:enhance action="?/loginWithPassword">
		<Form.Field {form} name="email" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>{m.clear_lost_goose_beam()}</Form.Label>
				<Input
					{...attrs}
					bind:value={$formData.email}
					{...stripPattern($constraints.email)}
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
	</form>
</FormWrapper>
