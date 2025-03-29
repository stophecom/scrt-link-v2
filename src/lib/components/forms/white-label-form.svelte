<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import Text from '$lib/components/forms/form-fields/text.svelte';
	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages.js';
	import { type WhiteLabelSiteSchema, whiteLabelSiteSchema } from '$lib/validators/formSchemas';

	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<WhiteLabelSiteSchema>;
	};

	let { form: formProp }: Props = $props();

	const form = superForm(formProp, {
		validators: zodClient(whiteLabelSiteSchema()),

		// We prioritize data returned from the load function
		// https://superforms.rocks/concepts/enhance#optimistic-updates
		invalidateAll: 'force',

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
	<form method="POST" use:enhance action="?/saveWhiteLabelSite">
		<Form.Field {form} name="name">
			<Text label="Brand name" bind:value={$formData.name} {...$constraints.name} type="text" />
		</Form.Field>

		<Form.Field {form} name="customDomain">
			<Text
				label="Custom Domain"
				bind:value={$formData.customDomain}
				{...$constraints.customDomain}
				type="text"
			/>
			<Form.Description
				>Add a custom domain like example.com or secret.example.com.
			</Form.Description>
		</Form.Field>

		<Form.Field {form} name="title">
			<Text label="Page title" bind:value={$formData.title} {...$constraints.title} type="text" />
		</Form.Field>
		<Form.Field {form} name="lead">
			<Text label="Page lead" bind:value={$formData.lead} {...$constraints.lead} type="text" />
		</Form.Field>

		<Form.Field {form} name="themeColor">
			<Text
				label="Theme color"
				bind:value={$formData.themeColor}
				{...$constraints.themeColor}
				type="color"
			/>
		</Form.Field>

		<Form.Button delayed={$delayed}>{m.caring_light_tiger_taste()}</Form.Button>
	</form>
</FormWrapper>
