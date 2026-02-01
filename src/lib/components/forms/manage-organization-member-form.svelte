<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import {
		type ManageOrganizationMemberFormSchema,
		manageOrganizationMemberFormSchema
	} from '$lib/validators/formSchemas';

	import Button from '../ui/button/button.svelte';
	// import Text from './form-fields/text.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<ManageOrganizationMemberFormSchema>;
		onSuccess?: () => void;
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
		onSuccess = () => {}
	}: Props = $props();

	const form = superForm(formProp, {
		validators: zod4Client(manageOrganizationMemberFormSchema()),
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
			onSuccess();
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
