<script lang="ts">
	import {
		decodeRecoveryCode,
		hashRecoveryKey,
		unwrapMasterKeyWithRecovery
	} from '@scrt-link/core';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { setMasterKey } from '$lib/client/key-manager';
	import FormWrapper from '$lib/components/forms/form-wrapper.svelte';
	import { SingleFormPage } from '$lib/components/page';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { m } from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { recoveryVerifyFormSchema } from '$lib/validators/formSchemas';

	type RecoveryVerifySchema = ReturnType<typeof recoveryVerifyFormSchema>;

	interface Props {
		form: SuperValidated<Infer<RecoveryVerifySchema>>;
		hasRecoveryKey: boolean;
	}

	let { form: formData, hasRecoveryKey }: Props = $props();

	let recoveryCode = $state('');

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
					setMasterKey(masterKey);

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
</script>

<SingleFormPage title={m.direct_left_buzzard_propel()} description={m.fuzzy_true_bird_fond()}>
	{#if !hasRecoveryKey}
		<div class="space-y-4">
			<div class="border-destructive/50 bg-destructive/10 rounded-lg border p-4">
				<p class="text-destructive text-sm font-semibold">{m.short_candid_termite_sway()}</p>
				<p class="text-muted-foreground mt-1 text-sm">
					{m.home_vexed_turtle_boost()}
				</p>
			</div>
			<a
				href={localizeHref('/set-password')}
				class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-medium"
			>
				{m.mean_swift_crossbill_clip()}
			</a>
		</div>
	{:else}
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
						{$delayed ? m.cute_seemly_poodle_reside() : m.simple_bad_haddock_agree()}
					</Form.Button>
				</div>

				{#if dev}
					<div class="py-3">
						<SuperDebug data={$recFormData} />
					</div>
				{/if}
			</form>
		</FormWrapper>
	{/if}
</SingleFormPage>
