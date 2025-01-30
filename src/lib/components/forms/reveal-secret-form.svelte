<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import * as m from '$lib/paraglide/messages.js';
	import { type RevealSecretFormSchema, revealSecretFormSchema } from '$lib/validators/formSchemas';
	import { decryptString } from '$lib/web-crypto';

	import Password from '../form-fields/password.svelte';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<Infer<RevealSecretFormSchema>>;
		secretIdHash: string;
		masterKey: string;
		showPasswordInput: boolean;
	};
	const { form, masterKey, secretIdHash, showPasswordInput }: Props = $props();
	let secret = $state('');

	const partialSchema = revealSecretFormSchema().omit({ password: true });

	const revealSecretForm = superForm(form, {
		validators: zodClient(showPasswordInput ? revealSecretFormSchema() : partialSchema),
		validationMethod: 'auto',
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				if (result?.data?.content) {
					secret = await decryptString(result.data.content, masterKey);

					if ($formData.password) {
						secret = await decryptString(secret, $formData.password);
					}
				}
				history.replaceState(null, 'Secret destroyed', '#🔥');
			}
		},
		onError(event) {
			// Fallback
			$message = {
				status: 'error',
				title: `${event.result.status}`,
				description: event.result.error.message
			};
		}
	});

	const { form: formData, message, delayed, constraints, enhance } = revealSecretForm;
</script>

<div class="w-full rounded border bg-card px-8 pb-8 pt-12 shadow-lg">
	{#if secret}
		{secret}
		<div class="flex justify-end pt-2">
			<Button data-sveltekit-reload href="/" class="mr-2" size="lg" variant="secondary"
				>{m.left_cool_raven_zap()}</Button
			>
			<CopyButton text={secret} />
		</div>
	{:else}
		{#if showPasswordInput}
			<h2 class="mb-4 text-3xl font-bold">{m.low_tame_lark_amaze()}</h2>
			<p class="mb-4 text-xl leading-normal">
				{m.alive_new_blackbird_stop()}
			</p>
		{:else}
			<p class="mb-4 text-xl leading-normal">
				{m.short_known_mule_play()}
			</p>
		{/if}
		<FormWrapper message={$message}>
			<form method="POST" use:enhance>
				{#if showPasswordInput}
					<Form.Field form={revealSecretForm} name="password" class="py-4">
						<Password
							bind:value={$formData.password}
							{...$constraints.password}
							placeholder="Password*"
						/>
					</Form.Field>
				{/if}
				<input type="hidden" name="secretIdHash" value={secretIdHash} />

				<div class="py-4">
					<Form.Button delayed={$delayed} class="w-full" size="lg"
						>{m.same_gaudy_iguana_bend()}</Form.Button
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
	{/if}
</div>
