<script lang="ts">
	import { type FormOptions, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import RadioGroup from '$lib/components/forms/form-fields/radio-group.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { MembershipRole } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';
	import {
		type InviteOrganizationMemberFormSchema,
		inviteOrganizationMemberFormSchema
	} from '$lib/validators/formSchemas';

	// import Text from './form-fields/text.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<InviteOrganizationMemberFormSchema>;
		onSubmit?: FormOptions['onSubmit'];
		organizationId: string;
		formAction: string;
	};

	let { organizationId, formAction, form: formProp, onSubmit = $bindable() }: Props = $props();

	const form = superForm(formProp, {
		validators: zod4Client(inviteOrganizationMemberFormSchema()),

		onSubmit: onSubmit,
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
	<form method="POST" use:enhance action={formAction}>
		<!-- <Form.Field {form} name="name" class="mb-2">
			<Text
				label={m.crazy_solid_cow_cuddle()}
				bind:value={$formData.name}
				{...$constraints.name}
				type="text"
			/>
		</Form.Field> -->
		<Form.Field {form} name="email" class="py-4">
			<Form.Control let:attrs>
				<Form.Label>{m.clear_lost_goose_beam()}</Form.Label>
				<Input {...attrs} bind:value={$formData.email} {...$constraints.email} type="email" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Fieldset {form} name="role" class="pb-4">
			<RadioGroup
				options={[
					{ value: MembershipRole.MEMBER, label: m.cuddly_flat_salmon_express() },
					{ value: MembershipRole.OWNER, label: 'Owner' }
				]}
				label={m.bad_close_anaconda_forgive()}
				bind:value={$formData.role}
			/>
			<input type="hidden" name="role" bind:value={$formData.role} />
		</Form.Fieldset>
		<input type="hidden" name="organizationId" bind:value={organizationId} />

		<div class="py-4">
			<Form.Button delayed={$delayed} class="w-full" size="lg"
				>{m.whole_crazy_gopher_favor()}</Form.Button
			>
		</div>
	</form>
</FormWrapper>
