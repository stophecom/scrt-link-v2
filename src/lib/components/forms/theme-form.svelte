<script lang="ts">
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

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
		validators: zod4Client(themeFormSchema()),
		dataType: 'json',
		invalidateAll: false,
		onChange: () => {
			form.submit();
		},
		onUpdated({ form: f }) {
			if (f.valid) {
				window.location.reload();
			}
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
				label={m.last_wild_mongoose_heart()}
				bind:value={$formData.themeOption}
			/>
		</Form.Fieldset>
	</form>
</FormWrapper>
