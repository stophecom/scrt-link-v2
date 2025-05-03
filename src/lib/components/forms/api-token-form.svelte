<script lang="ts">
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import Text from '$lib/components/forms/form-fields/text.svelte';
	import * as Form from '$lib/components/ui/form';
	import { getUserPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { apiKeyFormSchema, type ApiTokenFormSchema } from '$lib/validators/formSchemas';

	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<Infer<ApiTokenFormSchema>>;
		user: App.Locals['user'];
	};

	let { user, form: formProp }: Props = $props();

	const planLimits = getUserPlanLimits(user?.subscriptionTier);

	const form = superForm(formProp, {
		validators: zodClient(apiKeyFormSchema()),

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
	<form method="POST" use:enhance action="?/createAPIToken">
		<div class="grid grid-cols-[1fr_min-content] gap-2">
			<Form.Field {form} name="description">
				<Text
					label={m.light_royal_ladybug_greet()}
					isHiddenLabel
					placeholder={m.silly_sharp_skunk_walk()}
					bind:value={$formData.description}
					{...$constraints.description}
					description={m.fluffy_even_fox_greet()}
					disabled={!planLimits.apiAccess}
				/>
			</Form.Field>
			<Form.Button delayed={$delayed} class="my-2">{m.steep_equal_newt_grin()}</Form.Button>
		</div>
	</form>
</FormWrapper>
