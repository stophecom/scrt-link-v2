<script lang="ts">
	import BadgeCheck from '@lucide/svelte/icons/badge-check';
	import type { SuperValidated } from 'sveltekit-superforms';

	import { wait } from '$lib/client/utils';
	import ChangeEmailForm from '$lib/components/forms/change-email-form.svelte';
	import UserForm from '$lib/components/forms/user-form.svelte';
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { User as AuthUser } from '$lib/server/db/schema';
	import type {
		ChangeEmailConfirmFormSchema,
		ChangeEmailRequestFormSchema,
		UserFormSchema
	} from '$lib/validators/formSchemas';

	let {
		user,
		form,
		changeEmailRequestForm,
		changeEmailConfirmForm
	}: {
		user: Pick<
			AuthUser,
			'id' | 'name' | 'email' | 'role' | 'subscriptionTier' | 'picture' | 'googleId'
		> & {
			hasPassword?: boolean;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			preferences: any;
		};
		form: SuperValidated<UserFormSchema>;
		changeEmailRequestForm: SuperValidated<ChangeEmailRequestFormSchema>;
		changeEmailConfirmForm: SuperValidated<ChangeEmailConfirmFormSchema>;
	} = $props();

	let open = $state(false);
	let emailOpen = $state(false);

	// Only password accounts without a linked Google login can self-serve an email change.
	const canChangeEmail = $derived(Boolean(user.hasPassword) && !user.googleId);
</script>

{#snippet renderLabel(label: string)}
	<span class="inline-block p-1 font-medium">{label}</span>
{/snippet}

<Card class="mb-6" title={m.novel_proud_anaconda_zoom()}>
	<div class="flex items-center py-1">
		{@render renderLabel('Name:')}
		{form.data.name || 'Anonymous'}
		<Dialog.Root bind:open>
			(<Dialog.Trigger class="inline-block underline">{m.aloof_such_mare_dance()}</Dialog.Trigger>)
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>{m.spry_every_kangaroo_flip()}</Dialog.Title>
				</Dialog.Header>
				<UserForm
					{form}
					onSuccess={() => {
						wait(600).then(async () => {
							open = false;
						});
					}}
				/>
			</Dialog.Content>
		</Dialog.Root>
	</div>

	{#if canChangeEmail}
		<div class="flex items-center py-1">
			{@render renderLabel(m.mild_noble_orangutan_compose())}
			<span class="inline-flex items-center p-1"
				>{user?.email} <BadgeCheck class="text-muted-foreground ms-2 h-4 w-4" /></span
			>
			<Dialog.Root bind:open={emailOpen}>
				(<Dialog.Trigger class="inline-block underline">{m.aloof_such_mare_dance()}</Dialog.Trigger
				>)
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>{m.change_email_dialog_title()}</Dialog.Title>
					</Dialog.Header>
					<ChangeEmailForm
						requestForm={changeEmailRequestForm}
						confirmForm={changeEmailConfirmForm}
						onSuccess={() => {
							wait(1500).then(() => {
								emailOpen = false;
							});
						}}
					/>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{:else}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<div class="flex py-1">
					{@render renderLabel(m.mild_noble_orangutan_compose())}
					<span class="inline-flex cursor-not-allowed items-center p-1"
						>{user?.email} <BadgeCheck class="text-muted-foreground ms-2 h-4 w-4" /></span
					>
				</div>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{m.dizzy_light_pigeon_animate()}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{/if}

	<Separator class="my-6" />
	<div class="flex flex-wrap">
		<Button class="mr-2 mb-2" variant="outline" href={localizeHref('/set-password')}
			>{m.jumpy_factual_mole_hunt()}</Button
		>

		<Button variant="ghost" href={localizeHref('/delete-account')} class="text-destructive"
			>{m.home_sharp_jackdaw_endure()}</Button
		>
	</div>
</Card>
