<script lang="ts">
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import RadioGroupColors from '$lib/components/forms/form-fields/radio-group-colors.svelte';
	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages.js';
	import { type ThemeFormSchema, themeFormSchema } from '$lib/validators/formSchemas';

	import { getThemeOptions } from '../../data/secretSettings';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<Infer<ThemeFormSchema>>;
	};

	let { form: formProp }: Props = $props();

	const form = superForm(formProp, {
		validators: zodClient(themeFormSchema()),

		// We prioritize data returned from the load function
		// https://superforms.rocks/concepts/enhance#optimistic-updates
		invalidateAll: 'force',
		dataType: 'json',
		onChange: () => {
			const documentStyle = document.body.style;
			documentStyle.setProperty('--color-primary', `var(--theme-color-${$formData.themeOption})`);

			form.submit();
		},
		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'No further information available.'
			};
		}
	});

	const { form: formData, message, enhance } = form;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/saveTheme">
		<Form.Fieldset {form} name="themeOption">
			<RadioGroupColors
				options={getThemeOptions()}
				label={m.loved_yummy_kangaroo_dance()}
				bind:value={$formData.themeOption}
			/>
		</Form.Fieldset>
	</form>
</FormWrapper>
