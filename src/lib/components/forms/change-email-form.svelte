<script lang="ts">
	import { deriveAuthVerifier } from '@scrt-link/core';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { m } from '$lib/paraglide/messages.js';
	import {
		type ChangeEmailConfirmFormSchema,
		changeEmailConfirmFormSchema,
		type ChangeEmailRequestFormSchema,
		changeEmailRequestFormSchema
	} from '$lib/validators/formSchemas';

	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		requestForm: SuperValidated<ChangeEmailRequestFormSchema>;
		confirmForm: SuperValidated<ChangeEmailConfirmFormSchema>;
		onSuccess?: () => void;
	};

	let {
		requestForm: requestFormData,
		confirmForm: confirmFormData,
		onSuccess = () => {}
	}: Props = $props();

	let step = $state<'request' | 'confirm'>('request');
	// The plaintext password is held in memory across the two steps so the client can
	// re-derive the auth verifier with the new email salt at confirmation time.
	let heldPassword = $state('');
	let newEmail = $state('');

	type MessageResult = { data?: { form?: { message?: App.Superforms.Message } } };

	const requestForm = superForm(requestFormData, {
		validators: zod4Client(changeEmailRequestFormSchema()),
		validationMethod: 'auto',
		dataType: 'json',
		applyAction: false,
		resetForm: false,
		onSubmit: async ({ jsonData, cancel }) => {
			try {
				const currentEmail = page.data.user?.email ?? '';
				const verifier = await deriveAuthVerifier($requestData.currentPassword, currentEmail);
				heldPassword = $requestData.currentPassword;
				newEmail = $requestData.email;
				jsonData({ email: $requestData.email, currentPassword: verifier });
			} catch (e) {
				console.error('Failed to derive auth verifier:', e);
				$requestMessage = {
					status: 'error',
					title: m.weak_quaint_lamb_fry(),
					description: m.change_email_error_description()
				};
				cancel();
			}
		},
		onResult: async ({ result }) => {
			const formResult = (result as MessageResult).data?.form;
			if (formResult?.message) {
				$requestMessage = formResult.message;
				if (formResult.message.status === 'success') {
					$confirmData.email = newEmail;
					step = 'confirm';
				}
			}
		},
		onError({ result }) {
			$requestMessage = {
				status: 'error',
				title: `${result.status}`,
				description: result.error.message
			};
		}
	});

	const {
		form: requestData,
		message: requestMessage,
		constraints: requestConstraints,
		delayed: requestDelayed,
		enhance: requestEnhance
	} = requestForm;

	const confirmForm = superForm(confirmFormData, {
		validators: zod4Client(changeEmailConfirmFormSchema()),
		validationMethod: 'auto',
		dataType: 'json',
		applyAction: false,
		resetForm: false,
		onSubmit: async ({ jsonData, cancel }) => {
			if (!heldPassword) {
				// Password was lost (e.g. page reload) — restart the flow.
				step = 'request';
				$confirmMessage = {
					status: 'error',
					title: m.change_email_restart_title(),
					description: m.change_email_restart_description()
				};
				cancel();
				return;
			}
			try {
				const currentEmail = page.data.user?.email ?? '';
				const currentVerifier = await deriveAuthVerifier(heldPassword, currentEmail);
				const newPasswordVerifier = await deriveAuthVerifier(heldPassword, newEmail);
				jsonData({
					email: newEmail,
					code: $confirmData.code,
					currentPassword: currentVerifier,
					newPasswordVerifier
				});
			} catch (e) {
				console.error('Failed to derive auth verifier:', e);
				$confirmMessage = {
					status: 'error',
					title: m.weak_quaint_lamb_fry(),
					description: m.change_email_error_description()
				};
				cancel();
			}
		},
		onResult: async ({ result }) => {
			const formResult = (result as MessageResult).data?.form;
			if (formResult?.message) {
				$confirmMessage = formResult.message;
				if (formResult.message.status === 'success') {
					heldPassword = '';
					await invalidateAll();
					onSuccess();
				}
			}
		},
		onError({ result }) {
			$confirmMessage = {
				status: 'error',
				title: `${result.status}`,
				description: result.error.message
			};
		}
	});

	const {
		form: confirmData,
		message: confirmMessage,
		constraints: confirmConstraints,
		delayed: confirmDelayed,
		enhance: confirmEnhance
	} = confirmForm;
</script>

{#if step === 'request'}
	<FormWrapper message={$requestMessage}>
		<p class="text-muted-foreground mb-4 text-sm">{m.change_email_request_description()}</p>
		<form method="POST" action="?/requestEmailChange" use:requestEnhance>
			<Form.Field form={requestForm} name="email" class="py-2">
				<Form.Control let:attrs>
					<Form.Label>{m.change_email_new_label()}</Form.Label>
					<Input
						type="email"
						autocomplete="email"
						bind:value={$requestData.email}
						{...$requestConstraints.email}
						{...attrs}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field form={requestForm} name="currentPassword" class="py-2">
				<Form.Control let:attrs>
					<Form.Label>{m.yummy_fair_gazelle_link()} {m.neat_proud_crow_label()}</Form.Label>
					<Input
						type="password"
						autocomplete="current-password"
						bind:value={$requestData.currentPassword}
						{...$requestConstraints.currentPassword}
						{...attrs}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="py-4">
				<Form.Button delayed={$requestDelayed} class="w-full" size="lg">
					{m.change_email_send_code_button()}
				</Form.Button>
			</div>
		</form>
	</FormWrapper>
{:else}
	<FormWrapper message={$confirmMessage}>
		<p class="text-muted-foreground mb-4 text-sm">
			{m.change_email_confirm_description({ email: newEmail })}
		</p>
		<form method="POST" action="?/confirmEmailChange" use:confirmEnhance>
			<Form.Field form={confirmForm} name="code" class="py-2">
				<Form.Control let:attrs>
					<Form.Label>{m.few_lime_kudu_imagine()}</Form.Label>
					<Input bind:value={$confirmData.code} {...$confirmConstraints.code} {...attrs} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="py-4">
				<Form.Button delayed={$confirmDelayed} class="w-full" size="lg">
					{$confirmDelayed ? m.bold_warm_falcon_type() : m.change_email_confirm_button()}
				</Form.Button>
			</div>
		</form>
	</FormWrapper>
{/if}
