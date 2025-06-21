<script lang="ts">
	import { Palette, RefreshCcw, Save, SquareArrowUpRight } from '@lucide/svelte';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { derived } from 'svelte/store';
	import { stringProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { api } from '$lib/api';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import * as Form from '$lib/components/ui/form';
	import { getSecretTypes } from '$lib/data/secretSettings';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { type WhiteLabelMetaSchema, whiteLabelMetaSchema } from '$lib/validators/formSchemas';

	import type { DomainStatusResponse } from '../../../routes/api/v1/domain-status/[name]/+server';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';
	import Checkboxes from './form-fields/checkboxes.svelte';
	import RadioGroup from './form-fields/radio-group.svelte';
	import Switch from './form-fields/switch.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		isAdminFlag: boolean;
		form: SuperValidated<WhiteLabelMetaSchema>;
		whiteLabelDomain: string | null;
		organizationIdOptions: { value: string; label: string }[];
	};

	let { isAdminFlag, form: formProp, organizationIdOptions, whiteLabelDomain }: Props = $props();

	const form = superForm(formProp, {
		validators: zodClient(whiteLabelMetaSchema()),

		// We prioritize data returned from the load function
		// https://superforms.rocks/concepts/enhance#optimistic-updates
		invalidateAll: 'force',

		onSubmit() {
			queryClient.fetchQuery({ queryKey: ['domain-verification'] });
		},

		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'No further information available.'
			};
		}
	});

	const { form: formData, message, delayed, constraints, enhance, errors } = form;

	const organizationIdProxy = stringProxy(form, 'organizationId', { empty: 'null' }); // Cast to string
	// Queries
	const queryClient = useQueryClient();

	const queryResult = createQuery(
		derived(formData, ($formData) => ({
			queryKey: ['domain-verification'],
			queryFn: async () => {
				const data = await api<DomainStatusResponse>(
					`/domain-status/${$formData.customDomain || null}`,
					{
						method: 'GET'
					}
				);
				return data;
			},
			enabled: !!whiteLabelDomain
		}))
	);
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/saveWhiteLabelMeta">
		<Form.Field {form} name="name">
			<Text
				label={m.quaint_flaky_swan_cry()}
				bind:value={$formData.name}
				{...$constraints.name}
				type="text"
			/>
		</Form.Field>

		<Form.Fieldset {form} name="enabledSecretTypes">
			<Checkboxes
				label={m.arable_upper_parrot_lift()}
				description={m.pink_bright_coyote_heart()}
				bind:value={$formData.enabledSecretTypes}
				items={getSecretTypes()}
			/>
		</Form.Fieldset>

		<Form.Field {form} name="customDomain">
			<Text
				label={m.spicy_jolly_gibbon_glow()}
				bind:value={$formData.customDomain}
				{...$constraints.customDomain}
				type="text"
			/>
			<Form.Description>{m.small_house_goldfish_belong()}</Form.Description>
		</Form.Field>

		{#if whiteLabelDomain}
			<Alert
				class="relative"
				title={$queryResult.data?.message || m.awful_house_lizard_pick()}
				variant={$queryResult.isError ? 'destructive' : 'default'}
			>
				{#if !Object.values($errors).length}
					<div class="grid grid-cols-[1fr_min-content] gap-4">
						<div>
							{#if $queryResult.isError}
								{$queryResult.error.message}
							{:else if !$queryResult.data?.verified && $queryResult?.data?.instructions}
								<div class="mb-4">{m.blue_weird_osprey_ask()}</div>

								<div class="grid grid-cols-[min-content_min-content_1fr] gap-x-4">
									<div class="font-semibold">Type</div>
									<div class="font-semibold">Name</div>
									<div class="font-semibold">Value</div>

									{#each $queryResult.data.instructions as item}
										<div>{item.type}</div>
										<div class="whitespace-pre-wrap">{item.domain}</div>
										<div class="break-all">{item.value}</div>
									{/each}
								</div>
							{/if}
						</div>
						<div class="content-end">
							<Spinner
								class="absolute top-5 right-4 h-4 w-4 self-start transition-opacity {$queryResult.isFetching
									? 'opacity-100'
									: 'opacity-0'}"
							/>
							{#if !$queryResult.data?.verified && whiteLabelDomain}
								<Button
									variant="outline"
									size="sm"
									onclick={() => queryClient.fetchQuery({ queryKey: ['domain-verification'] })}
									><RefreshCcw class="me-2 h-4 w-4" /> {m.ago_equal_nuthatch_expand()}</Button
								>
							{/if}
						</div>
					</div>
				{/if}
			</Alert>
		{/if}

		{#if isAdminFlag}
			<Form.Field {form} name="isPrivate" class="py-4">
				<Switch bind:checked={$formData.isPrivate} label={m.quaint_careful_ostrich_buy()} />
				<Form.Description>{m.mealy_keen_felix_believe()}</Form.Description>
			</Form.Field>
			{#if $formData.isPrivate}
				<Form.Fieldset {form} name="organizationId">
					<RadioGroup
						options={organizationIdOptions}
						bind:value={$organizationIdProxy}
						label={m.north_bright_tadpole_laugh()}
					/>
				</Form.Fieldset>
				<!-- @todo Unclear why the hidden input is necessary. -->
				<input type="hidden" name="organizationId" bind:value={$formData.organizationId} />
			{/if}
		{/if}
		<div class="pt-4">
			<Form.Button delayed={$delayed}
				><Save class="me-2 h-4 w-4" /> {m.caring_light_tiger_taste()}</Form.Button
			>
		</div>
		<Separator class="my-4" />
		<div class="flex items-center">
			<Button
				class="me-2"
				variant="outline"
				href={localizeHref(`/account/edit/${$formData.customDomain}`)}
				><Palette class="me-2 h-5 w-5" />{m.home_witty_piranha_peek()}</Button
			>
			{#if $queryResult.data?.verified}
				<Button variant="ghost" href={`https://${$formData.customDomain}`}
					>{$formData.customDomain} <SquareArrowUpRight class="ms-2 h-5 w-5" /></Button
				>
			{/if}
		</div>
	</form>
</FormWrapper>
