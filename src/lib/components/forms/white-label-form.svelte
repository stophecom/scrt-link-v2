<script lang="ts">
	import { Save } from '@lucide/svelte';
	import { stringProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import { getSecretTypes } from '$lib/data/secretSettings';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { type WhiteLabelMetaSchema, whiteLabelMetaSchema } from '$lib/validators/formSchemas';

	import Checkboxes from './form-fields/checkboxes.svelte';
	import Select from './form-fields/select.svelte';
	import Switch from './form-fields/switch.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<WhiteLabelMetaSchema>;
		organizationIdOptions: { value: string; label: string }[];
	};

	let { form: formProp, organizationIdOptions }: Props = $props();

	const form = superForm(formProp, {
		validators: zod4Client(whiteLabelMetaSchema()),
		invalidateAll: 'force',

		onError({ result }) {
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'No further information available.'
			};
		}
	});

	const { form: formData, message, delayed, enhance } = form;

	const organizationIdProxy = stringProxy(form, 'organizationId', { empty: 'null' });
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/saveWhiteLabelMeta">
		<Form.Field {form} name="organizationId">
			<div class="flex items-center gap-2">
				<div class="pr-2">
					<Select
						label={m.wild_inner_fox_honor()}
						options={organizationIdOptions}
						bind:value={$organizationIdProxy}
					/>
				</div>
				{#if organizationIdOptions.length <= 1}
					<a
						href={localizeHref('/account/organization')}
						class="text-muted-foreground hover:text-foreground mt-5 shrink-0 text-xs underline"
						>{m.bold_neat_panda_learn()}</a
					>
				{/if}
			</div>
			<Form.Description>{m.blue_wild_snake_approve()}</Form.Description>
		</Form.Field>
		<!-- @todo Unclear why the hidden input is necessary. -->
		<input type="hidden" name="organizationId" bind:value={$formData.organizationId} />

		<Form.Fieldset {form} name="enabledSecretTypes">
			<Checkboxes
				label={m.arable_upper_parrot_lift()}
				description={m.pink_bright_coyote_heart()}
				bind:value={$formData.enabledSecretTypes}
				items={getSecretTypes()}
			/>
		</Form.Fieldset>

		<Form.Field {form} name="enableSecretRequests" class="py-4">
			<Switch bind:checked={$formData.enableSecretRequests} label={m.bold_warm_fox_toggle()} />
			<Form.Description>{m.mild_calm_deer_hint()}</Form.Description>
		</Form.Field>

		<Form.Field {form} name="isPrivate" class="py-4">
			<Switch bind:checked={$formData.isPrivate} label={m.quaint_careful_ostrich_buy()} />
			<Form.Description>{m.mealy_keen_felix_believe()}</Form.Description>
		</Form.Field>

		<div class="pt-4">
			<Form.Button delayed={$delayed}
				><Save class="me-2 h-4 w-4" /> {m.caring_light_tiger_taste()}</Form.Button
			>
		</div>
	</form>
</FormWrapper>
