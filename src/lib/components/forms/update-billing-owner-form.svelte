<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { m } from '$lib/paraglide/messages.js';
	import { type UpdateBillingOwnerSchema, updateBillingOwnerSchema } from '$lib/validators/formSchemas';

	type Member = { userId: string; name: string | null; email: string };

	type Props = {
		form: SuperValidated<UpdateBillingOwnerSchema>;
		members: Member[];
	};

	let { form: formProp, members }: Props = $props();

	const form = superForm(formProp, {
		validators: zod4Client(updateBillingOwnerSchema()),
		invalidateAll: 'force',
		onUpdated({ form }) {
			if (form.message?.status === 'success') {
				toast.success(form.message.title ?? '');
			} else if (form.message?.status === 'error') {
				toast.error(form.message.title ?? '');
			}
		}
	});

	const { form: formData, enhance } = form;

	const selectedLabel = $derived(
		members.find((m) => m.userId === $formData.billingOwnerId)?.email ??
			m.flat_warm_mem_select()
	);
</script>

<form method="POST" action="?/updateOrganizationBillingOwner" use:enhance>
	<div class="flex flex-wrap items-center gap-3">
		<Select.Root type="single" bind:value={$formData.billingOwnerId}>
			<Select.Trigger class="w-64">{selectedLabel}</Select.Trigger>
			<Select.Content>
				{#each members as member (member.userId)}
					<Select.Item value={member.userId}>
						{member.name ?? member.email}
						<span class="text-muted-foreground ml-1 text-xs">({member.email})</span>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<input type="hidden" name="billingOwnerId" bind:value={$formData.billingOwnerId} />
		<input type="hidden" name="organizationId" bind:value={$formData.organizationId} />
		<Button type="submit" size="sm" variant="outline">{m.caring_light_tiger_taste()}</Button>
	</div>
</form>
