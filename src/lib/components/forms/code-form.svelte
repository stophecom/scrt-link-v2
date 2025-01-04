<script lang="ts">
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Alert from '$lib/components/ui/alert';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages.js';
	import { type CodeFormSchema, codeFormSchema } from '$lib/validators/formSchemas';

	export let data: SuperValidated<Infer<CodeFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(codeFormSchema),
		validationMethod: 'auto',
		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				type: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'Some error'
			};
		}
	});

	const { form: formData, message, constraints, enhance } = form;
</script>

<form method="POST" action="?/verifyCode" use:enhance>
	<Form.Field {form} name="code" class="py-4">
		<Form.Control let:attrs>
			<Form.Label>{m.few_lime_kudu_imagine()}</Form.Label>
			<Input {...attrs} bind:value={$formData.code} {...$constraints.code} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<input name="email" type="hidden" bind:value={$formData.email} />

	<div class="py-4">
		<Form.Button size="lg">Submit</Form.Button>
	</div>

	<!-- Global error messages -->
	{#if $message}
		<div class="py-3">
			<Alert.Root variant="destructive">
				<CircleAlert class="h-4 w-4" />
				<Alert.Title>{$message.title}</Alert.Title>
				<Alert.Description>{$message.description}</Alert.Description>
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
