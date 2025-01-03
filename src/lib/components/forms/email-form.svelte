<script lang="ts">
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import * as Alert from '$lib/components/ui/alert';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages.js';
	import { type EmailFormSchema, emailFormSchema } from '$lib/validators/formSchemas';

	export let data: SuperValidated<Infer<EmailFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(emailFormSchema),
		validationMethod: 'auto',
		onError({ result }) {
			// We use message for unexpected errors
			$message = result.error.message || 'Unknown error';
		}
	});

	const { form: formData, message, constraints, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="email" class="py-4">
		<Form.Control let:attrs>
			<Form.Label>{m.clear_lost_goose_beam()}</Form.Label>
			<Input {...attrs} bind:value={$formData.email} {...$constraints.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="py-4">
		<Form.Button size="lg">Continue with email</Form.Button>
	</div>

	<!-- Global error messages -->
	{#if $message}
		<div class="py-3">
			<Alert.Root variant="destructive">
				<CircleAlert class="h-4 w-4" />
				<Alert.Title>Es ist ein Fehler aufgetreten - {page.status}</Alert.Title>
				<Alert.Description>{$message}</Alert.Description>
			</Alert.Root>
		</div>
	{/if}

	<!-- For debugging -->
	{#if dev}
		<div class="py-3">
			<SuperDebug data={$formData} />
		</div>
	{/if}
</form>
