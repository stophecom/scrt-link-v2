<script lang="ts">
	import { derivePDK, generateEncryptionSetup, unwrapMasterKey } from '@scrt-link/core';
	import { Checkbox } from 'bits-ui';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { setMasterKey, tryRestoreKey } from '$lib/client/key-manager';
	import { getPendingPassword } from '$lib/client/pending-password';
	import Password from '$lib/components/forms/form-fields/password.svelte';
	import FormWrapper from '$lib/components/forms/form-wrapper.svelte';
	import { SingleFormPage } from '$lib/components/page';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import CheckboxUi from '$lib/components/ui/checkbox/checkbox.svelte';
	import CopyButton from '$lib/components/ui/copy-button';
	import * as Form from '$lib/components/ui/form';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { type PasswordFormSchema, passwordFormSchema } from '$lib/validators/formSchemas';

	interface Props {
		passwordForm: SuperValidated<Infer<PasswordFormSchema>>;
		encryptionEnabled: boolean;
		keyStore: {
			pdkSalt: string;
			pdkIterations: number;
			encryptedMasterKey: string;
		} | null;
	}

	let { passwordForm: passwordFormData, encryptionEnabled, keyStore }: Props = $props();

	type Step = 'loading' | 'unlock' | 'password' | 'recovery';
	let step = $state<Step>(encryptionEnabled ? 'loading' : 'password');

	// Resolve initial step after attempting IndexedDB key restore
	if (encryptionEnabled) {
		tryRestoreKey().then((restored) => {
			if (step === 'loading') {
				if (restored) {
					goto(localizeHref('/account'));
				} else {
					step = 'unlock';
				}
			}
		});
	}
	let recoveryCode = $state('');
	let saved = $state(false);
	let isSubmitting = $state(false);
	let encError = $state<App.Superforms.Message | undefined>(undefined);

	// Crypto values generated during step transition, bound to hidden inputs
	let generatedPdkSalt = $state('');
	let generatedPdkIterations = $state('600000');
	let generatedEncryptedMasterKey = $state('');
	let generatedRecoveryEncryptedMasterKey = $state('');
	let generatedRecoveryKeyHash = $state('');

	let pendingMasterKey: CryptoKey | null = null;

	// Generate all crypto artifacts and populate state for the recovery step
	async function runEncryptionSetup(password: string): Promise<boolean> {
		try {
			const setup = await generateEncryptionSetup(password);

			generatedPdkSalt = setup.pdkSalt;
			generatedPdkIterations = String(setup.pdkIterations);
			generatedEncryptedMasterKey = setup.encryptedMasterKey;
			generatedRecoveryEncryptedMasterKey = setup.recoveryEncryptedMasterKey;
			generatedRecoveryKeyHash = setup.recoveryKeyHash;
			pendingMasterKey = setup.masterKey;
			recoveryCode = setup.recoveryCode;
			step = 'recovery';
			return true;
		} catch (e) {
			console.error('[encryption] Key generation failed:', e);
			return false;
		}
	}

	// --- Step 1: Password verification form ---
	const pwForm = superForm(passwordFormData, {
		validators: zod4Client(passwordFormSchema()),
		validationMethod: 'auto',
		applyAction: false,

		onUpdated: async ({ form }) => {
			if (form.message?.status === 'success' && !form.errors.password) {
				const pw = form.data.password;

				runEncryptionSetup(pw).then((ok) => {
					if (!ok) {
						$pwMessage = {
							status: 'error',
							title: 'Error',
							description: 'Failed to generate encryption keys. Please try again.'
						};
					}
				});
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
		form: pwFormData,
		message: pwMessage,
		delayed: pwDelayed,
		constraints: pwConstraints,
		enhance: enhancePW
	} = pwForm;

	// Unlock MK with password (for OAuth users or returning sessions)
	let unlockError = $state('');
	let isUnlocking = $state(false);

	async function unlockWithPassword() {
		if (!keyStore) return;
		isUnlocking = true;
		unlockError = '';

		try {
			const { pdkSalt, pdkIterations, encryptedMasterKey } = keyStore;
			const pdk = await derivePDK($pwFormData.password, pdkSalt, pdkIterations);
			const masterKey = await unwrapMasterKey(encryptedMasterKey, pdk);
			setMasterKey(masterKey);
			goto(localizeHref('/account'));
		} catch {
			unlockError = 'Incorrect password. Please try again.';
		} finally {
			isUnlocking = false;
		}
	}

	// If coming from login with a pending password, skip the verify step
	if (!encryptionEnabled) {
		const pw = getPendingPassword();
		if (pw) {
			runEncryptionSetup(pw).then((ok) => {
				if (!ok) step = 'password';
			});
		}
	}

	const stepDescriptions: Record<Step, string> = {
		loading: 'Checking encryption status...',
		unlock: 'Enter your password to unlock your encryption keys for this session.',
		password:
			'Enter your password to set up encryption. This will generate a master encryption key protected by your password. The server never sees your encryption keys.',
		recovery: 'Store your recovery key in a safe place.'
	};

	const stepTitles: Record<Step, string> = {
		loading: 'Encryption',
		unlock: 'Unlock Encryption',
		password: 'Set Up Encryption',
		recovery: 'Recovery Key'
	};
</script>

<SingleFormPage title={stepTitles[step]} description={stepDescriptions[step]}>
	{#if step === 'loading'}
		<div class="py-8 text-center">
			<p class="text-muted-foreground text-sm">Loading...</p>
		</div>
	{:else if step === 'unlock'}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				unlockWithPassword();
			}}
		>
			{#if unlockError}
				<Alert variant="destructive" title="Error" class="mb-4">
					{unlockError}
				</Alert>
			{/if}

			<Form.Field form={pwForm} name="password" class="py-4">
				<Password
					bind:value={$pwFormData.password}
					{...$pwConstraints.password}
					autocomplete="current-password"
				/>
			</Form.Field>

			<div class="py-4">
				<Form.Button delayed={isUnlocking} class="w-full" size="lg">
					{isUnlocking ? 'Unlocking...' : 'Unlock'}
				</Form.Button>
			</div>

			<p class="text-muted-foreground text-center text-xs">
				<a
					href={localizeHref('/recover-encryption')}
					class="text-primary hover:text-primary/80 underline"
				>
					Forgot your password? Use recovery key
				</a>
			</p>
		</form>
	{:else if step === 'password'}
		<FormWrapper message={$pwMessage}>
			<form method="POST" use:enhancePW action="?/verifyCurrentPassword">
				<Form.Field form={pwForm} name="password" class="py-4">
					<Password
						bind:value={$pwFormData.password}
						{...$pwConstraints.password}
						autocomplete="current-password"
					/>
				</Form.Field>

				<div class="py-4">
					<Form.Button delayed={$pwDelayed} class="w-full" size="lg">
						{$pwDelayed ? 'Verifying...' : 'Continue'}
					</Form.Button>
				</div>

				{#if dev}
					<div class="py-3">
						<SuperDebug data={$pwFormData} />
					</div>
				{/if}
			</form>
		</FormWrapper>
	{:else if step === 'recovery'}
		<FormWrapper message={encError}>
			<form
				method="POST"
				action="?/setupEncryptionKeys"
				use:enhance={() => {
					isSubmitting = true;
					encError = undefined;

					return async ({ result }) => {
						isSubmitting = false;

						if (result.type === 'success') {
							if (pendingMasterKey) {
								setMasterKey(pendingMasterKey);
								pendingMasterKey = null;
							}
							goto(localizeHref('/account'));
						} else {
							console.error('[encryption] Server result:', result);
							encError = {
								status: 'error',
								title: 'Error',
								description: 'Server failed to save encryption keys. Please try again.'
							};
						}
					};
				}}
			>
				<div class="space-y-4">
					<Alert variant="info" title="Save this recovery key now. It will only be shown once.">
						<p class="mb-3">
							Store it somewhere safe and offline. If you lose both your password and this key, your
							encrypted data cannot be recovered.
						</p>
						<code
							class="bg-background text-foreground block rounded p-3 text-center font-mono text-sm tracking-wider select-all"
							data-testid="recovery-code"
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
						data-testid="checkbox-saved-recovery"
					>
						<CheckboxUi checked={saved} />
						<span class="text-sm">I have saved my recovery key in a safe place</span>
					</Checkbox.Root>

					<input type="hidden" name="pdkSalt" value={generatedPdkSalt} />
					<input type="hidden" name="pdkIterations" value={generatedPdkIterations} />
					<input type="hidden" name="encryptedMasterKey" value={generatedEncryptedMasterKey} />
					<input
						type="hidden"
						name="recoveryEncryptedMasterKey"
						value={generatedRecoveryEncryptedMasterKey}
					/>
					<input type="hidden" name="recoveryKeyHash" value={generatedRecoveryKeyHash} />

					<Form.Button
						delayed={isSubmitting}
						class="w-full"
						size="lg"
						disabled={!saved}
						data-testid="submit-encryption"
					>
						{isSubmitting ? 'Setting up encryption...' : 'Enable Encryption'}
					</Form.Button>
				</div>
			</form>
		</FormWrapper>
	{/if}
</SingleFormPage>
