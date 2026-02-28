<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import RadioGroup from '$lib/components/forms/form-fields/radio-group.svelte';
	import * as Form from '$lib/components/ui/form';
	import { MembershipRole } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages';
	import {
		type ManageOrganizationMemberFormSchema,
		manageOrganizationMemberFormSchema
	} from '$lib/validators/formSchemas';

	import Button from '../ui/button/button.svelte';
	// import Text from './form-fields/text.svelte';
	import FormWrapper from './form-wrapper.svelte';
	import { Separator } from '$lib/components/ui/separator';

	type Props = {
		form: SuperValidated<ManageOrganizationMemberFormSchema>;
		onSuccess?: () => void;
		inviteId?: string;
		userId?: string;
		organizationId: string;
		isCurrentUser?: boolean;
		isOwner?: boolean;
		initialRole?: MembershipRole | null;
	};

	let {
		userId,
		inviteId,
		organizationId,
		form: formProp,
		isCurrentUser,
		isOwner = false,
		initialRole,
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

	const { form: formData, message, enhance } = form;

	$effect(() => {
		if (initialRole) {
			$formData.role = initialRole;
		}
	});
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/manageOrganizationMember">
		{#if isOwner}
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
			{#if userId || inviteId}
				<Button type="submit" formaction="?/manageOrganizationMember" class="mb-2 w-full"
					>{m.caring_light_tiger_taste()}</Button
				>
			{/if}
		{/if}

		<Separator class="my-6" />

		{#if userId}
			<Button
				type="submit"
				formaction="?/removeOrganizationMember"
				variant="destructive"
				class="w-full"
			>
				{#if isCurrentUser}
					{m.weary_any_loris_work()}
				{:else}
					{m.wild_funny_dog_dazzle()}
				{/if}
			</Button>
			<input type="hidden" name="userId" value={userId} />
		{/if}

		{#if inviteId}
			<Button
				type="submit"
				formaction="?/removeOrganizationMember"
				variant="destructive"
				class="w-full">{m.main_nice_goldfish_flow()}</Button
			>
			<input type="hidden" name="inviteId" value={inviteId} />
		{/if}

		<input type="hidden" name="organizationId" value={organizationId} />
	</form>
</FormWrapper>
