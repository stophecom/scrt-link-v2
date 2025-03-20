<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import Password from '$lib/components/forms/form-fields/password.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { type SignInFormSchema, signInFormSchema } from '$lib/validators/formSchemas';

	import Link from '../ui/link';
	import FormWrapper from './form-wrapper.svelte';

	export let data: SuperValidated<Infer<SignInFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(signInFormSchema()),
		validationMethod: 'auto',

		onError({ result }) {
			// We use message for unexpected errors
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
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password" class="py-4">
			<Password
				bind:value={$formData.password}
				{...$constraints.password}
				autocomplete="current-password"
			/>

			<Form.Description
				><Link class="text-xs" href={localizeHref('/reset-password')}
					>{m.less_free_osprey_buzz()}</Link
				></Form.Description
			>
		</Form.Field>

		<div class="py-4">
			<Form.Button delayed={$delayed} class="flex w-full" size="lg"
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
