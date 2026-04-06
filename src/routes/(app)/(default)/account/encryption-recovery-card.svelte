<script lang="ts">
	import { derivePDK, generateNewRecoveryKey, unwrapMasterKey } from '@scrt-link/core';
	import { Checkbox } from 'bits-ui';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { enhance } from '$app/forms';
	import { setMasterKey } from '$lib/client/key-manager';
	import Password from '$lib/components/forms/form-fields/password.svelte';
	import FormWrapper from '$lib/components/forms/form-wrapper.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Card from '$lib/components/ui/card';
	import CheckboxUi from '$lib/components/ui/checkbox/checkbox.svelte';
	import CopyButton from '$lib/components/ui/copy-button';
	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages';
	import {
		type PasswordFormSchema,
		passwordFormSchema,
		type RecoverySetupFormSchema
	} from '$lib/validators/formSchemas';

	type KeyStore = {
		pdkSalt: string;
		pdkIterations: number;
		encryptedMasterKey: string;
	};

	type Props = {
		hasRecoveryKey: boolean;
		keyStore: KeyStore | null;
		passwordForm: SuperValidated<Infer<PasswordFormSchema>>;
		recoveryForm: SuperValidated<Infer<RecoverySetupFormSchema>>;
	};

	let { hasRecoveryKey, keyStore, passwordForm: pwFormData }: Props = $props();

	type Step = 'password' | 'recovery' | 'done';
	let step = $state<Step>('password');
	let recoveryCode = $state('');
	let saved = $state(false);
	let isSubmitting = $state(false);
	let encError = $state<App.Superforms.Message | undefined>(undefined);

	let generatedRecoveryEncryptedMasterKey = $state('');
	let generatedRecoveryKeyHash = $state('');

	let capturedPassword = '';

	const pwForm = superForm(pwFormData, {
		validators: zod4Client(passwordFormSchema()),
		onSubmit: async () => {
			capturedPassword = $pwForm_formData.password;
		},
		onUpdated: async ({ form }) => {
			if (form.message?.status === 'success' && !form.errors.password) {
				if (!keyStore) {
					$pwMessage = {
						status: 'error',
						title: m.weak_quaint_lamb_fry(),
						description: m.dry_tame_robin_lift()
					};
					return;
				}

				try {
					const pdk = await derivePDK(capturedPassword, keyStore.pdkSalt, keyStore.pdkIterations);
					const masterKey = await unwrapMasterKey(keyStore.encryptedMasterKey, pdk);
					setMasterKey(masterKey);

					const recovery = await generateNewRecoveryKey(masterKey);
					generatedRecoveryEncryptedMasterKey = recovery.recoveryEncryptedMasterKey;
					generatedRecoveryKeyHash = recovery.recoveryKeyHash;
					recoveryCode = recovery.recoveryCode;
					step = 'recovery';
				} catch (e) {
					console.error('[recovery] Key unlock/generation failed:', e);
					$pwMessage = {
						status: 'error',
						title: m.weak_quaint_lamb_fry(),
						description: m.cool_shy_walrus_dare()
					};
				}
			}
		},
		onError({ result }) {
			$pwMessage = {
				status: 'error',
				title: `${result.status}`,
				description: result.error.message
			};
		}
	});

	const {
		form: pwForm_formData,
		message: pwMessage,
		delayed: pwDelayed,
		constraints: pwConstraints,
		enhance: pwEnhance
	} = pwForm;
</script>

<Card class="mb-6" title={m.deft_mean_camel_nourish()} description={m.rich_proud_eagle_view()}>
	{#if step === 'done'}
		<Alert variant="success" title={m.swift_keen_otter_gaze()}>
			{m.soft_warm_finch_sing()}
		</Alert>
	{:else if step === 'password'}
		{#if hasRecoveryKey}
			<Alert variant="info" title={m.dark_bold_raven_soar()} class="mb-4">
				{m.wise_calm_dove_rest()}
			</Alert>
		{/if}

		<FormWrapper message={$pwMessage}>
			<form method="POST" use:pwEnhance action="?/verifyCurrentPassword">
				<Form.Field form={pwForm} name="password" class="py-4">
					<Password
						bind:value={$pwForm_formData.password}
						{...$pwConstraints.password}
						autocomplete="current-password"
					/>
				</Form.Field>

				<div class="py-4">
					<Form.Button delayed={$pwDelayed} class="w-full" size="lg">
						{$pwDelayed ? m.aware_tense_pig_vent() : m.pale_swift_hawk_call()}
					</Form.Button>
				</div>
			</form>
		</FormWrapper>
	{:else if step === 'recovery'}
		<FormWrapper message={encError}>
			<form
				method="POST"
				action="?/setupRecoveryKey"
				use:enhance={() => {
					isSubmitting = true;
					encError = undefined;

					return async ({ result }) => {
						isSubmitting = false;

						if (result.type === 'success') {
							step = 'done';
						} else {
							console.error('[recovery] Server result:', result);
							encError = {
								status: 'error',
								title: m.weak_quaint_lamb_fry(),
								description: m.vast_deep_heron_wade()
							};
						}
					};
				}}
			>
				<div class="space-y-4">
					<Alert variant="info" title={m.save_this_recovery_key()}>
						<p class="mb-3">
							{m.flat_pink_weasel_gulp()}
						</p>
						<code
							class="bg-background text-foreground block rounded p-3 text-center font-mono text-sm tracking-wider select-all"
						>
							{recoveryCode}
						</code>
						<div class="mt-3">
							<CopyButton text={recoveryCode} variant="outline" size="sm" />
						</div>
					</Alert>

					<Checkbox.Root
						checked={saved}
						onCheckedChange={(v) => (saved = v === true)}
						class="flex cursor-pointer items-center gap-3"
					>
						<CheckboxUi checked={saved} />
						<span class="text-sm">{m.petty_sweet_quail_believe()}</span>
					</Checkbox.Root>

					<input
						type="hidden"
						name="recoveryEncryptedMasterKey"
						value={generatedRecoveryEncryptedMasterKey}
					/>
					<input type="hidden" name="recoveryKeyHash" value={generatedRecoveryKeyHash} />

					<Form.Button delayed={isSubmitting} class="w-full" size="lg" disabled={!saved}>
						{isSubmitting ? m.blue_kind_crane_step() : m.gold_true_lark_rise()}
					</Form.Button>
				</div>
			</form>
		</FormWrapper>
	{/if}
</Card>
