<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import Google from '$lib/assets/images/Google.svg?component';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages.js';
	import { type SignInFormSchema, signInFormSchema } from '$lib/validators/formSchemas';

	import Button from '../ui/button/button.svelte';
	import Link from '../ui/link';
	import Separator from '../ui/separator/separator.svelte';
	import FormWrapper from './form-wrapper.svelte';

	export let data: SuperValidated<Infer<SignInFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(signInFormSchema()),
		validationMethod: 'auto',
		resetForm: false,
		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				type: 'error',
				title: 'Unknown error',
				description: result.error.message
			};
		}
	});

	const { form: formData, message, errors, delayed, constraints, enhance } = form;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance>
		<Form.Field {form} name="email" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>{m.clear_lost_goose_beam()}</Form.Label>
				<Input {...attrs} bind:value={$formData.email} {...$constraints.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>{m.tame_actual_raven_adapt()}</Form.Label>
				<Input
					type="password"
					{...attrs}
					bind:value={$formData.password}
					{...$constraints.password}
				/>
				{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
				<Form.Description
					><Link class="text-xs" href="/reset-password">{m.less_free_osprey_buzz()}</Link
					></Form.Description
				>
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>

		<div class="py-4">
			<Form.Button delayed={$delayed} class="flex w-full" size="lg"
				>{m.legal_weak_jay_bless()}</Form.Button
			>
		</div>
		<div class="px-5 text-center text-sm">
			{m.warm_ideal_butterfly_radiate()}
			<Link href="/signup">{m.grassy_sea_pug_gasp()}</Link>
		</div>

		<!-- For debugging -->
		{#if dev}
			<div class="py-3">
				<SuperDebug data={$formData} />
			</div>
		{/if}
	</form>

	<div class="py-5">
		<Separator />
	</div>

	<Button class="w-full" variant="outline" size="lg" href="/login/google"
		><Google class="mr-3" />{m.major_noble_snake_drop()}</Button
	>
</FormWrapper>
