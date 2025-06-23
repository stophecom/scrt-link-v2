<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { type FormOptions, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import {
		type ManageOrganizationMemberFormSchema,
		manageOrganizationMemberFormSchema
	} from '$lib/validators/formSchemas';

	import Button from '../ui/button/button.svelte';
	// import Text from './form-fields/text.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<ManageOrganizationMemberFormSchema>;
		onSubmit?: FormOptions['onSubmit'];
		inviteId?: string;
		userId?: string;
		organizationId: string;
		formAction: string;
	};

	let {
		userId,
		inviteId,
		organizationId,
		formAction,
		form: formProp,
		onSubmit = $bindable()
	}: Props = $props();

	const form = superForm(formProp, {
		validators: zodClient(manageOrganizationMemberFormSchema()),
		validationMethod: 'auto',
		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'Some error'
			};
		},
		onUpdated: ({ form }) => {
			if (form.message?.status === 'success' && form.message?.title) {
				toast.success(form.message.title);
			}
		}
	});

	const { message, enhance } = form;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action={formAction}>
		{#if userId}
			<Button type="submit" variant="destructive">Remove member</Button>
			<input type="hidden" name="userId" value={userId} />
		{/if}
		{#if inviteId}
			<Button type="submit" variant="destructive">Revoke invitation</Button>
			<input type="hidden" name="inviteId" value={inviteId} />
		{/if}
		<input type="hidden" name="organizationId" value={organizationId} />
	</form>
</FormWrapper>
