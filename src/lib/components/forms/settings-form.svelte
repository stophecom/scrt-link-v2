<script lang="ts">
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import RadioGroup from '$lib/components/forms/form-fields/radio-group.svelte';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import * as Form from '$lib/components/ui/form';
	import { getPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { type SettingsFormSchema, settingsFormSchema } from '$lib/validators/formSchemas';

	import { getReadReceiptOptions } from '../../data/secretSettings';
	import UpgradeNotice from '../elements/upgrade-notice.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<Infer<SettingsFormSchema>>;
		user: App.Locals['user'];
	};

	let { user, form: formProp }: Props = $props();

	const planLimits = getPlanLimits(user?.subscriptionTier);

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

		{#if $formData.readReceiptOption !== 'none' && !planLimits.readReceiptsAllowed}
			<UpgradeNotice {user} />
		{/if}

		{#if $formData.readReceiptOption === 'email'}
			<Form.Field {form} name="email">
				<Text
					label={m.just_every_oryx_flop()}
					bind:value={$formData.email}
					{...$constraints.email}
					type="email"
					disabled={!planLimits.readReceiptsAllowed}
				/>
				<Form.Description>{m.hour_royal_moose_kiss()}</Form.Description>
			</Form.Field>
		{/if}

		{#if $formData.readReceiptOption === 'ntfy'}
			<Form.Field {form} name="ntfyEndpoint">
				<Text
					label={m.sea_zippy_piranha_lift()}
					placeholder="unique-endpoint123"
					bind:value={$formData.ntfyEndpoint}
					{...$constraints.ntfyEndpoint}
					description={m.nimble_mushy_felix_drop({ link: '[https://ntfy.sh](https://ntfy.sh)' })}
					disabled={!planLimits.readReceiptsAllowed}
				/>
			</Form.Field>
		{/if}

		<Form.Button delayed={$delayed} class="ml-auto ">{m.caring_light_tiger_taste()}</Form.Button>
	</form>
</FormWrapper>
