<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import PartyPopper from '@lucide/svelte/icons/party-popper';
	import { onMount } from 'svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { page } from '$app/state';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import FormWrapper from '$lib/components/forms/form-wrapper.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { MembershipRole } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { stripPattern } from '$lib/utils';
	import {
		type InviteOrganizationMemberFormSchema,
		inviteOrganizationMemberFormSchema,
		type OrganizationFormSchema,
		organizationFormSchema,
		type UserFormSchema,
		userFormSchema
	} from '$lib/validators/formSchemas';

	type Props = {
		userForm: SuperValidated<UserFormSchema>;
		organizationForm: SuperValidated<OrganizationFormSchema>;
		inviteForm: SuperValidated<InviteOrganizationMemberFormSchema>;
	};

	let { userForm, organizationForm, inviteForm }: Props = $props();

	// The actual discount is configured in Stripe; checkout already accepts promo codes.
	const PROMO_CODE = 'WELCOMEPROMOTION';
	const ONBOARDING_ACTION = '/account/onboarding';
	const TOTAL_STEPS = 3;
	const stepIndices = [...Array(TOTAL_STEPS).keys()];

	let open = $state(true);
	let step = $state(1);
	let invited = $state<string[]>([]);
	// Set when "Save and continue" submits a pending invite; we advance once it succeeds.
	let advanceAfterInvite = $state(false);
	let promoCopied = $state(false);

	// The user's organization, kept fresh via each form's `invalidateAll: 'force'`.
	// After the org is created this becomes non-null and step 2 reveals the invite form.
	const organizations = $derived(
		(page.data.userOrganizations ?? []) as { id: string; name: string }[]
	);
	const organization = $derived(organizations[0] ?? null);

	// Persist "seen" once on first display — the wizard shows only once per account.
	onMount(() => {
		fetch(`${ONBOARDING_ACTION}?/dismissWelcomeWizard`, {
			method: 'POST',
			body: new FormData()
		}).catch(() => {});
	});

	// Lock background scroll while the overlay is open.
	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	const unexpectedError = (message?: string) => ({
		status: 'error' as const,
		title: 'Unexpected error',
		description: message || 'No further information available.'
	});

	// --- Step 1: name ---
	const nameForm = superForm(userForm, {
		validators: zod4Client(userFormSchema()),
		invalidateAll: 'force',
		onUpdate: ({ result }) => {
			if (result.type === 'success') step = 2;
		},
		onError: ({ result }) => {
			$nameMessage = unexpectedError(result.error.message);
		}
	});
	const {
		form: nameData,
		message: nameMessage,
		enhance: nameEnhance,
		constraints: nameConstraints,
		delayed: nameDelayed
	} = nameForm;

	// --- Step 2a: create organization ---
	// On success `invalidateAll` refreshes `organizations`, revealing the invite form below.
	const orgForm = superForm(organizationForm, {
		validators: zod4Client(organizationFormSchema()),
		invalidateAll: 'force',
		onError: ({ result }) => {
			$orgMessage = unexpectedError(result.error.message);
		}
	});
	const {
		form: orgData,
		message: orgMessage,
		enhance: orgEnhance,
		constraints: orgConstraints,
		delayed: orgDelayed
	} = orgForm;

	// --- Step 2b: invite members ---
	const memberForm = superForm(inviteForm, {
		validators: zod4Client(inviteOrganizationMemberFormSchema()),
		invalidateAll: 'force',
		onUpdate: ({ form, result }) => {
			if (result.type === 'success') {
				if (form.data.email) invited = [...invited, form.data.email];
				if (advanceAfterInvite) {
					advanceAfterInvite = false;
					step = 3;
				}
			}
		},
		onError: ({ result }) => {
			advanceAfterInvite = false;
			$memberMessage = unexpectedError(result.error.message);
		}
	});
	const {
		form: memberData,
		message: memberMessage,
		enhance: memberEnhance,
		constraints: memberConstraints,
		delayed: memberDelayed
	} = memberForm;

	let inviteFormEl: HTMLFormElement | null = $state(null);

	// "Save and continue" on the team step: send a pending invite (if any) then advance.
	const saveTeamAndContinue = () => {
		if ($memberData.email && inviteFormEl) {
			advanceAfterInvite = true;
			inviteFormEl.requestSubmit();
		} else {
			step = 3;
		}
	};

	const copyPromo = async () => {
		try {
			await navigator.clipboard.writeText(PROMO_CODE);
			promoCopied = true;
			setTimeout(() => (promoCopied = false), 2000);
		} catch {
			// Clipboard unavailable — the code is visible for manual copy.
		}
	};

	const finish = () => {
		open = false;
	};
</script>

{#if open}
	<div
		class="bg-foreground/50 fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-labelledby="welcome-wizard-title"
	>
		<div class="border-rainbow relative my-auto w-full max-w-lg rounded-lg p-0.5 shadow-lg">
			<div class="bg-card rounded-lg p-6 sm:p-8">
				<!-- Step indicator -->
				<div class="mb-6 flex items-center gap-1.5" aria-hidden="true">
					{#each stepIndices as i (i)}
						<span
							class="h-1.5 flex-1 rounded-full transition-colors {i + 1 <= step
								? 'bg-foreground'
								: 'bg-muted'}"
						></span>
					{/each}
				</div>
				<p class="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
					{m.welcome_wizard_step_label({ current: step, total: TOTAL_STEPS })}
				</p>

				{#if step === 1}
					<!-- Step 1: welcome + name -->
					<h2
						id="welcome-wizard-title"
						class="mb-2 flex items-center gap-2 text-2xl font-bold text-pretty"
					>
						<PartyPopper class="h-6 w-6 shrink-0" />
						{m.welcome_wizard_welcome_title()}
					</h2>
					<p class="text-muted-foreground mb-6 text-pretty">
						{m.welcome_wizard_welcome_intro()}
					</p>

					<FormWrapper message={$nameMessage}>
						<form method="POST" action="{ONBOARDING_ACTION}?/saveUser" use:nameEnhance>
							<Form.Field form={nameForm} name="name" class="mb-4">
								<Text
									label={m.welcome_wizard_name_label()}
									bind:value={$nameData.name}
									{...$nameConstraints.name}
									type="text"
									placeholder="Jane Doe"
								/>
							</Form.Field>

							<div class="mt-6 flex items-center justify-between gap-3">
								<Button type="button" variant="ghost" onclick={() => (step = 2)}>
									{m.welcome_wizard_skip()}
								</Button>
								<Form.Button delayed={$nameDelayed}>
									{m.welcome_wizard_save_continue()}
								</Form.Button>
							</div>
						</form>
					</FormWrapper>
				{:else if step === 2}
					<!-- Step 2: organization + invite -->
					<h2 id="welcome-wizard-title" class="mb-2 text-2xl font-bold text-pretty">
						{m.welcome_wizard_team_title()}
					</h2>
					<p class="text-muted-foreground mb-6 text-pretty">
						{m.welcome_wizard_team_intro()}
					</p>

					{#if !organization}
						<FormWrapper message={$orgMessage}>
							<form method="POST" action="{ONBOARDING_ACTION}?/createOrganization" use:orgEnhance>
								<Form.Field form={orgForm} name="name" class="mb-2">
									<Text
										label={m.welcome_wizard_team_name_label()}
										bind:value={$orgData.name}
										{...$orgConstraints.name}
										type="text"
										placeholder="Acme Inc."
									/>
								</Form.Field>
								<input type="hidden" name="organizationId" value={$orgData.organizationId ?? ''} />

								<div class="mt-6 flex items-center justify-between gap-3">
									<Button type="button" variant="ghost" onclick={() => (step = 3)}>
										{m.welcome_wizard_skip()}
									</Button>
									<Form.Button delayed={$orgDelayed}>
										{m.welcome_wizard_save_continue()}
									</Form.Button>
								</div>
							</form>
						</FormWrapper>
					{:else}
						<div
							class="border-success/40 bg-success/10 text-success mb-4 flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
						>
							<Check class="h-4 w-4 shrink-0" />
							{m.welcome_wizard_team_created({ name: organization.name })}
						</div>

						<div class="bg-muted/40 mb-4 rounded-lg border p-4">
							<p class="mb-3 text-sm font-medium">{m.welcome_wizard_invite_title()}</p>

							<FormWrapper message={$memberMessage}>
								<form
									bind:this={inviteFormEl}
									method="POST"
									action="{ONBOARDING_ACTION}?/addMemberToOrganization"
									use:memberEnhance
								>
									<div class="flex items-start gap-2">
										<Form.Field form={memberForm} name="email" class="flex-1 py-0">
											<Form.Control let:attrs>
												<Form.Label class="sr-only">{m.clear_lost_goose_beam()}</Form.Label>
												<Input
													{...attrs}
													bind:value={$memberData.email}
													{...stripPattern($memberConstraints.email)}
													type="email"
													placeholder="teammate@example.com"
												/>
											</Form.Control>
											<Form.FieldErrors />
										</Form.Field>

										<!-- Always invite as Member; the role can be changed later on the org page. -->
										<input type="hidden" name="role" value={MembershipRole.MEMBER} />
										<input type="hidden" name="organizationId" value={organization.id} />

										<Button type="submit" disabled={$memberDelayed}>
											{m.welcome_wizard_add()}
										</Button>
									</div>
								</form>
							</FormWrapper>

							{#if invited.length}
								<ul class="text-muted-foreground mt-3 space-y-1 text-sm">
									{#each invited as email (email)}
										<li class="flex items-center gap-1.5">
											<Check class="text-success h-3.5 w-3.5 shrink-0" />
											{m.welcome_wizard_invited({ email })}
										</li>
									{/each}
								</ul>
							{/if}
						</div>

						<div class="mt-6 flex items-center justify-between gap-3">
							<Button type="button" variant="ghost" onclick={() => (step = 3)}>
								{m.welcome_wizard_skip()}
							</Button>
							<Button type="button" onclick={saveTeamAndContinue} disabled={$memberDelayed}>
								{m.welcome_wizard_save_continue()}
							</Button>
						</div>
					{/if}
				{:else}
					<!-- Step 3: promote premium + promo code -->
					<h2 id="welcome-wizard-title" class="mb-2 text-2xl font-bold text-pretty">
						{m.welcome_wizard_premium_title()}
					</h2>
					<p class="text-muted-foreground mb-6 text-pretty">
						{m.welcome_wizard_premium_intro()}
					</p>

					<div class="bg-muted/50 mb-6 rounded-lg border p-4">
						<p class="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
							{m.welcome_wizard_promo_label()}
						</p>
						<div class="flex items-center justify-between gap-3">
							<code class="text-lg font-bold tracking-wider">{PROMO_CODE}</code>
							<Button type="button" variant="outline" size="sm" onclick={copyPromo}>
								{#if promoCopied}
									<Check class="mr-1 h-4 w-4" />{m.welcome_wizard_copied()}
								{:else}
									<Copy class="mr-1 h-4 w-4" />{m.welcome_wizard_copy()}
								{/if}
							</Button>
						</div>
						<p class="text-muted-foreground mt-2 text-xs">
							{m.welcome_wizard_promo_hint()}
						</p>
					</div>

					<div class="flex items-center justify-between gap-3">
						<a href={localizeHref('/pricing')} class={buttonVariants({ variant: 'outline' })}>
							{m.welcome_wizard_view_plans()}
						</a>
						<Button type="button" onclick={finish}>
							{m.welcome_wizard_done()}
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
