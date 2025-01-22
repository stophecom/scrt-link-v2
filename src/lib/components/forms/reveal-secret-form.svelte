<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages.js';
	import { type RevealSecretFormSchema, revealSecretFormSchema } from '$lib/validators/formSchemas';
	import { decryptString } from '$lib/web-crypto';

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

<FormWrapper message={$message}>
	<form method="POST" use:enhance>
		{#if showPasswordInput}
			<Form.Field form={revealSecretForm} name="password" class="py-4">
				<Form.Control let:attrs>
					<Form.Label>{m.yummy_fair_gazelle_link()}</Form.Label>
					<Input
						type="password"
						{...attrs}
						bind:value={$formData.password}
						{...$constraints.password}
					/>
				</Form.Control>
				<Form.FieldErrors />
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

{secret}
