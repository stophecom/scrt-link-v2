<script lang="ts">
	import {
		decodeRecoveryCode,
		hashRecoveryKey,
		unwrapMasterKeyWithRecovery
	} from '@scrt-link/core';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { setMasterKey } from '$lib/client/key-manager';
	import Switch from '$lib/components/forms/form-fields/switch.svelte';
	import FormWrapper from '$lib/components/forms/form-wrapper.svelte';
	import { SingleFormPage } from '$lib/components/page';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { m } from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { recoveryVerifyFormSchema, resetEncryptionSchema } from '$lib/validators/formSchemas';

	type RecoveryVerifySchema = ReturnType<typeof recoveryVerifyFormSchema>;
	type ResetEncryptionSchema = ReturnType<typeof resetEncryptionSchema>;

	interface Props {
		form: SuperValidated<Infer<RecoveryVerifySchema>>;
		resetForm: SuperValidated<Infer<ResetEncryptionSchema>>;
		hasRecoveryKey: boolean;
		secretRequestCount: number;
	}

	let {
		form: formData,
		resetForm: resetFormData,
		hasRecoveryKey,
		secretRequestCount
	}: Props = $props();

	let recoveryCode = $state('');

	// Hidden behind a click when a recovery key exists, so the destructive path is
	// never the first thing a user who still has their key reaches for. Shown
	// straight away when no recovery key was ever generated — there is nothing
	// else they can do.
	let resetRequested = $state(false);
	const showReset = $derived(resetRequested || !hasRecoveryKey);

	const recoveryForm = superForm(formData, {
		validators: zod4Client(recoveryVerifyFormSchema()),
		validationMethod: 'auto',
		dataType: 'json',
		resetForm: false,
		applyAction: false,

		onSubmit: async ({ jsonData }) => {
			const recoveryBytes = decodeRecoveryCode(recoveryCode);
			const hash = await hashRecoveryKey(recoveryBytes);

			$recFormData.recoveryKeyHash = hash;
			jsonData({ recoveryKeyHash: hash });
		},
		onResult: async ({ result }) => {
			if (result.type === 'success' && result.data?.recoveryEncryptedMasterKey) {
				try {
					const recoveryBytes = decodeRecoveryCode(recoveryCode);
					const masterKey = await unwrapMasterKeyWithRecovery(
						result.data.recoveryEncryptedMasterKey,
						recoveryBytes
					);
					const userId = page.data.user?.id;
					if (!userId) throw new Error('User not loaded');
					setMasterKey(userId, masterKey);

					// Navigate to set-password where the user can set a new password
					return goto(localizeHref('/set-password'));
				} catch (e) {
					console.error('Failed to unwrap master key:', e);
					$message = {
						status: 'error',
						title: m.mad_such_albatross_cherish(),
						description: m.fun_lime_shark_talk()
					};
				}
			}
		},
		onError(event) {
			$message = {
				status: 'error',
				title: `${event.result.status}`,
				description: event.result.error.message
			};
		}
	});

	const { form: recFormData, message, delayed, constraints, enhance } = recoveryForm;

	// Plain form: the server does the whole reset in one transaction and redirects
	// to /set-password, so there is nothing for the client to compute here.
	const resetEncryptionForm = superForm(resetFormData, {
		validators: zod4Client(resetEncryptionSchema()),
		validationMethod: 'auto',
		onError(event) {
			$resetMessage = {
				status: 'error',
				title: `${event.result.status}`,
				description: event.result.error.message
			};
		}
	});

	const {
		form: resetFields,
		message: resetMessage,
		delayed: resetDelayed,
		enhance: resetEnhance
	} = resetEncryptionForm;
</script>

<SingleFormPage title={m.direct_left_buzzard_propel()} description={m.fuzzy_true_bird_fond()}>
	{#if hasRecoveryKey}
		<FormWrapper message={$message}>
			<form method="POST" use:enhance action="?/verifyRecoveryKey">
				<Form.Field form={recoveryForm} name="recoveryKeyHash" class="py-4">
					<label for="recoveryKey" class="text-sm font-medium">{m.deft_mean_camel_nourish()}</label>
					<Input
						id="recoveryKey"
						type="text"
						bind:value={recoveryCode}
						placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
						{...$constraints.recoveryKeyHash}
						autocomplete="off"
						class="font-mono tracking-wider"
					/>
				</Form.Field>

				<input type="hidden" name="recoveryKeyHash" bind:value={$recFormData.recoveryKeyHash} />

				<div class="py-4">
					<Form.Button delayed={$delayed} class="w-full" size="lg">
						{$delayed ? m.aware_tense_pig_vent() : m.simple_bad_haddock_agree()}
					</Form.Button>
				</div>
			</form>
		</FormWrapper>
	{:else}
		<Alert variant="destructive" title={m.short_candid_termite_sway()} class="mb-2">
			{m.home_vexed_turtle_boost()}
		</Alert>
	{/if}

	{#if showReset}
		<div class="mt-6 border-t pt-6">
			<Alert variant="destructive" title={m.plain_civic_heron_start()}>
				{m.tidy_bold_badger_renew({ count: secretRequestCount })}
			</Alert>

			<FormWrapper message={$resetMessage}>
				<form method="POST" use:resetEnhance action="?/resetEncryption">
					<Form.Field form={resetEncryptionForm} name="confirm" class="py-4">
						<Switch bind:checked={$resetFields.confirm} label={m.every_calm_pelican_vow()} />
					</Form.Field>

					<div class="py-2">
						<Form.Button variant="destructive" delayed={$resetDelayed} class="w-full" size="lg"
							>{m.glad_fresh_wombat_reset()}</Form.Button
						>
					</div>
				</form>
			</FormWrapper>
		</div>
	{:else}
		<div class="mt-6 border-t pt-6 text-center">
			<Button variant="link" onclick={() => (resetRequested = true)}>
				{m.brave_lucky_otter_mend()}
			</Button>
		</div>
	{/if}
</SingleFormPage>
