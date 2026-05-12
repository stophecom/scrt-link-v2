<script lang="ts">
	import { RefreshCcw, Save, SquareArrowUpRight } from '@lucide/svelte';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { derived } from 'svelte/store';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	import { api } from '$lib/api';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages.js';
	import { type WhiteLabelDomainSchema, whiteLabelDomainSchema } from '$lib/validators/formSchemas';

	import type { DomainStatusResponse } from '../../../routes/api/v1/domain-status/[name]/+server';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<WhiteLabelDomainSchema>;
		whiteLabelDomain: string | null;
	};

	let { form: formProp, whiteLabelDomain }: Props = $props();

	const form = superForm(formProp, {
		validators: zod4Client(whiteLabelDomainSchema()),
		invalidateAll: 'force',

		onSubmit() {
			queryClient.fetchQuery({ queryKey: ['domain-verification'] });
		},

		onError({ result }) {
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'No further information available.'
			};
		}
	});

	const { form: formData, message, delayed, constraints, enhance, errors } = form;

	const queryClient = useQueryClient();

	const queryResult = createQuery(
		derived(formData, ($formData) => ({
			queryKey: ['domain-verification'],
			queryFn: async () => {
				const data = await api<DomainStatusResponse>(
					`/domain-status/${$formData.customDomain || null}`,
					{ method: 'GET' }
				);
				return data;
			},
			enabled: !!whiteLabelDomain
		}))
	);
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/saveWhiteLabelDomain">
		<Form.Field {form} name="name">
			<Text
				label={m.quaint_flaky_swan_cry()}
				bind:value={$formData.name}
				{...$constraints.name}
				type="text"
			/>
		</Form.Field>

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

									{#each $queryResult.data.instructions as item (item.value)}
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

		<div class="pt-4">
			<Form.Button delayed={$delayed}
				><Save class="me-2 h-4 w-4" /> {m.caring_light_tiger_taste()}</Form.Button
			>
		</div>

		{#if $queryResult.data?.verified}
			<Separator class="my-4" />
			<div class="flex items-center">
				<Button variant="ghost" href={`https://${$formData.customDomain}`}
					>{$formData.customDomain} <SquareArrowUpRight class="ms-2 h-5 w-5" /></Button
				>
			</div>
		{/if}
	</form>
</FormWrapper>
