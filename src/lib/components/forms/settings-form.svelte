<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import { getReadReceiptOptions } from '$lib/data/secretSettings';
	import * as m from '$lib/paraglide/messages.js';
	import { type SettingsFormSchema, settingsFormSchema } from '$lib/validators/formSchemas';

	import type { LayoutServerData } from '../../../routes/$types';
	import RadioGroup from '../form-fields/radio-group.svelte';
	import Text from '../form-fields/text.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<Infer<SettingsFormSchema>>;
		user: LayoutServerData['user'];
	};

	let { form: formProp, user }: Props = $props();

	const form = superForm(formProp, {
		validators: zodClient(settingsFormSchema()),

		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'Some error'
			};
		}
	});

	const { form: formData, message, delayed, constraints, enhance } = form;
</script>

<FormWrapper message={$message}>
	Hello {user?.name}
	<form method="POST" use:enhance>
		<Form.Field {form} name="name">
			<Text label="Name" bind:value={$formData.name} {...$constraints.name} />
		</Form.Field>

		<Form.Fieldset {form} name="readReceiptOptions">
			<RadioGroup
				options={getReadReceiptOptions()}
				label={m.slimy_broad_dachshund_lock()}
				bind:value={$formData.readReceiptOptions}
			/>
		</Form.Fieldset>

		<Form.Field {form} name="ntfyEndpoint">
			<Text
				label="Ntfy Endpoint"
				bind:value={$formData.ntfyEndpoint}
				{...$constraints.ntfyEndpoint}
				description="*Unique endpoint that is used to send you notifications to your ntfy app. For more info
					visit [https://ntfy.sh](https://ntfy.sh)"
			/>
		</Form.Field>

		<Form.Button delayed={$delayed} class="ml-auto " size="lg">Save</Form.Button>
	</form>
	{#if dev}
		<SuperDebug data={$formData} />
	{/if}
</FormWrapper>
