<script lang="ts">
	import { derivePDK, generatePdkSalt, unwrapMasterKey, wrapMasterKey } from '@scrt-link/core';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import {
		getMasterKey,
		isKeyUnlocked,
		setMasterKey,
		tryRestoreKey
	} from '$lib/client/key-manager';
	import { setPendingPassword } from '$lib/client/pending-password';
	import Password from '$lib/components/forms/form-fields/password.svelte';
	import FormWrapper from '$lib/components/forms/form-wrapper.svelte';
	import PasswordForm from '$lib/components/forms/password-form.svelte';
	import { SingleFormPage } from '$lib/components/page';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import {
		passwordChangeWithEncryptionFormSchema,
		type PasswordFormSchema
	} from '$lib/validators/formSchemas';

	type EncPasswordSchema = ReturnType<typeof passwordChangeWithEncryptionFormSchema>;

	interface Props {
		encryptionEnabled: boolean;
		keyStore: {
			pdkSalt: string;
			pdkIterations: number;
			encryptedMasterKey: string;
		} | null;
		form: SuperValidated<Infer<PasswordFormSchema>>;
		encryptionForm: SuperValidated<Infer<EncPasswordSchema>> | null;
	}

	let {
		encryptionEnabled,
		keyStore,
		form: passwordFormData,
		encryptionForm: encryptionFormData
	}: Props = $props();

	let success = $state(false);

	// In recovery flow, MK is already unlocked in memory (set by /recover-encryption)
	// Check synchronously first, then try IndexedDB restore
	let isRecoveryFlow = $state(encryptionEnabled && isKeyUnlocked());

	if (encryptionEnabled && !isRecoveryFlow) {
		tryRestoreKey().then((restored) => {
			if (restored) isRecoveryFlow = true;
		});
	}

	// Encryption-aware password change form
	const encryptionForm = encryptionFormData
		? superForm(encryptionFormData, {
				validators: zod4Client(passwordChangeWithEncryptionFormSchema()),
				validationMethod: 'auto',
				dataType: 'json',
				applyAction: false,
				resetForm: false,
				onSubmit: async ({ jsonData, cancel }) => {
					if (!keyStore) {
						$encMessage = {
							status: 'error',
							title: 'Error',
							description: 'Encryption key data not found.'
						};
						cancel();
						return;
					}

					try {
						let masterKey: CryptoKey;
						const { pdkSalt: oldSalt, pdkIterations, encryptedMasterKey: wrappedMk } = keyStore;

						if (isRecoveryFlow) {
							// Recovery flow: MK already in memory from /recover-encryption
							masterKey = getMasterKey();
						} else {
							// Normal flow: derive old PDK and unwrap MK using current password
							const oldPdk = await derivePDK(
								$encFormData.currentPassword ?? '',
								oldSalt,
								pdkIterations
							);
							masterKey = await unwrapMasterKey(wrappedMk, oldPdk);
							setMasterKey(masterKey);
						}

						// Derive new PDK with fresh salt and re-wrap master key
						const newSalt = generatePdkSalt();
						const newPdk = await derivePDK($encFormData.password, newSalt, pdkIterations);
						const newWrappedMk = await wrapMasterKey(masterKey, newPdk);

						const payload: Record<string, string> = {
							password: $encFormData.password,
							pdkSalt: newSalt,
							encryptedMasterKey: newWrappedMk
						};

						// Only include currentPassword when not in recovery flow
						if (!isRecoveryFlow && $encFormData.currentPassword) {
							payload.currentPassword = $encFormData.currentPassword;
						}

						jsonData(payload);
					} catch (e) {
						console.error('Failed to re-wrap master key:', e);
						$encMessage = {
							status: 'error',
							title: 'Decryption failed',
							description: 'Could not decrypt with current password. Please check your password.'
						};
						cancel();
					}
				},
				onResult: async ({ result }) => {
					const formResult = (result as { data?: { form?: { message?: App.Superforms.Message } } })
						.data?.form;
					if (formResult?.message) {
						$encMessage = formResult.message;
						if (formResult.message.status === 'success') {
							success = true;
						}
					}
				},
				onError(event) {
					$encMessage = {
						status: 'error',
						title: `${event.result.status}`,
						description: event.result.error.message
					};
				}
			})
		: null;

	// Only destructure when encryptionForm exists — these are accessed inside {#if} guards
	const encFormData = encryptionForm?.form;
	const encMessage = encryptionForm?.message;
	const encDelayed = encryptionForm?.delayed;
	const encConstraints = encryptionForm?.constraints;
	const encEnhance = encryptionForm?.enhance;
</script>

<SingleFormPage title={m.front_fun_husky_pray()} description={m.male_ornate_mantis_feel()}>
	{#if success}
		<div class="space-y-6">
			<Alert variant="success" title={m.plain_aloof_gopher_pop()}>
				{m.trick_dizzy_bobcat_wish()}
			</Alert>
			<a href="/account">
				<Button class="w-full" size="lg">Go to Account</Button>
			</a>
		</div>
	{:else if encryptionEnabled && encryptionForm}
		<FormWrapper message={$encMessage}>
			<form method="POST" use:encEnhance action="?/setPassword">
				{#if !isRecoveryFlow}
					<Form.Field form={encryptionForm} name="currentPassword" class="py-4">
						<Form.Control let:attrs>
							<Form.Label>{m.yummy_fair_gazelle_link()} (current)</Form.Label>
							<Input
								type="password"
								placeholder={m.yummy_fair_gazelle_link()}
								bind:value={$encFormData.currentPassword}
								{...$encConstraints.currentPassword}
								{...attrs}
								autocomplete="current-password"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				{/if}

				<Form.Field form={encryptionForm} name="password" class="py-4">
					<Password
						bind:value={$encFormData.password}
						{...$encConstraints.password}
						autocomplete="new-password"
					/>
				</Form.Field>

				<div class="py-4">
					<Form.Button delayed={$encDelayed} class="w-full" size="lg">
						{$encDelayed ? 'Updating...' : m.flat_moving_finch_assure()}
					</Form.Button>
				</div>

				{#if dev}
					<div class="py-3">
						<SuperDebug data={$encFormData} />
					</div>
				{/if}
			</form>
		</FormWrapper>
	{:else}
		<PasswordForm
			form={passwordFormData}
			onSuccess={(password) => {
				if (!encryptionEnabled) {
					// First-time password set (e.g. OAuth user) — redirect to encryption setup
					setPendingPassword(password);
					goto('/encryption');
				} else {
					success = true;
				}
			}}
		/>
	{/if}
</SingleFormPage>
