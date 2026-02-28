<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { m } from '$lib/paraglide/messages';
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
		isCurrentUser?: boolean;
	};

	let {
		userId,
		inviteId,
		organizationId,
		formAction,
		form: formProp,
		isCurrentUser,
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
		onUpdated: () => {
			onSuccess();
		}
	});

	const { message, enhance } = form;
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action={formAction}>
		{#if userId}
			<Button type="submit" variant="destructive">
				{#if isCurrentUser}
					{m.weary_any_loris_work()}
				{:else}
					{m.wild_funny_dog_dazzle()}
				{/if}
			</Button>
			<input type="hidden" name="userId" value={userId} />
		{/if}
		{#if inviteId}
			<Button type="submit" variant="destructive">Revoke invitation</Button>
			<input type="hidden" name="inviteId" value={inviteId} />
		{/if}
		<input type="hidden" name="organizationId" value={organizationId} />
	</form>
</FormWrapper>
