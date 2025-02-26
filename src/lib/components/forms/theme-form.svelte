<script lang="ts">
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import * as m from '$lib/paraglide/messages.js';
	import { type ThemeFormSchema, themeFormSchema } from '$lib/validators/formSchemas';

	import type { LayoutServerData } from '../../../routes/$types';
	import { getThemeOptions } from '../../data/secretSettings';
	import RadioGroup from '../form-fields/radio-group.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<Infer<ThemeFormSchema>>;
		user: LayoutServerData['user'];
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

	const { form: formData, message, delayed, enhance } = form;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/saveTheme">
		<Form.Fieldset {form} name="themeOption">
			<RadioGroup
				options={getThemeOptions()}
				label="Theme Color"
				bind:value={$formData.themeOption}
			/>
		</Form.Fieldset>

		<Form.Button delayed={$delayed} class="ml-auto ">{m.caring_light_tiger_taste()}</Form.Button>
	</form>
	{#if dev}
		<div class="py-4">
			<SuperDebug data={$formData} />
		</div>
	{/if}
</FormWrapper>
