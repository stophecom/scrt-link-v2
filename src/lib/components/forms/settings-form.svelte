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

	let { form: formProp }: Props = $props();

	const form = superForm(formProp, {
		validators: zodClient(settingsFormSchema()),

		// We prioritize data returned from the load function
		// https://superforms.rocks/concepts/enhance#optimistic-updates
		invalidateAll: 'force',
		dataType: 'json',
		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'No further information available.'
			};
		}
	});

	const { form: formData, message, delayed, constraints, enhance } = form;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/saveSettings">
		<Form.Fieldset {form} name="readReceiptOption">
			<RadioGroup
				options={getReadReceiptOptions()}
				label={m.slimy_broad_dachshund_lock()}
				bind:value={$formData.readReceiptOption}
			/>
		</Form.Fieldset>

		{#if $formData.readReceiptOption === 'email'}
			<Form.Field {form} name="email">
				<Text label="Email" bind:value={$formData.email} {...$constraints.email} type="email" />
			</Form.Field>
		{/if}

		{#if $formData.readReceiptOption === 'ntfy'}
			<Form.Field {form} name="ntfyEndpoint">
				<Text
					label="Ntfy Endpoint"
					bind:value={$formData.ntfyEndpoint}
					{...$constraints.ntfyEndpoint}
					description="*Unique endpoint that is used to send you notifications to your ntfy app. For more info
					visit [https://ntfy.sh](https://ntfy.sh)"
				/>
			</Form.Field>
		{/if}

		<Form.Button delayed={$delayed} class="ml-auto ">{m.caring_light_tiger_taste()}</Form.Button>
	</form>
	{#if dev}
		<div class="py-4">
			<SuperDebug data={$formData} />
		</div>
	{/if}
</FormWrapper>
