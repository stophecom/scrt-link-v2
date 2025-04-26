<script lang="ts">
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { Palette, SquareArrowUpRight } from 'lucide-svelte';
	import { derived, writable } from 'svelte/store';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { api } from '$lib/api';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { type WhiteLabelMetaSchema, whiteLabelMetaSchema } from '$lib/validators/formSchemas';

	import type { DomainStatusResponse } from '../../../routes/api/v1/domain-status/[name]/+server';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<WhiteLabelMetaSchema>;
	};

	let { form: formProp }: Props = $props();

	// Queries
	const queryClient = useQueryClient();

	let intervalMs = writable(5000);
	const queryResult = createQuery(
		derived(intervalMs, ($intervalMs) => ({
			queryKey: ['domain-verification'],
			queryFn: async () => {
				const data = await api<DomainStatusResponse>(`/domain-status/${$formData.customDomain}`, {
					method: 'GET'
				});
				return data;
			},
			refetchInterval: $intervalMs
		}))
	);

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

	const { form: formData, message, delayed, constraints, enhance } = form;

	$effect(() => {
		if ($queryResult.data?.verified) {
			$intervalMs = 0;
		} else {
			$intervalMs = 5000;
		}
	});
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/saveWhiteLabelMeta">
		<Form.Field {form} name="name">
			<Text
				label="App or brand name"
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

		<Alert
			class="relative"
			title={$queryResult.data?.message || m.awful_house_lizard_pick()}
			variant={$queryResult.isError ? 'destructive' : 'default'}
		>
			<Spinner
				class="absolute top-5 right-5 h-4 w-4 transition-opacity {$queryResult.isFetching
					? 'opacity-100'
					: 'opacity-0'}"
			/>
			{#if $queryResult.isError}
				{$queryResult.error.message}
			{:else if !$queryResult.data?.verified}
				{#if $queryResult?.data?.instructions}
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
			{/if}
		</Alert>
		<div class="pt-4">
			<Form.Button delayed={$delayed}>{m.caring_light_tiger_taste()}</Form.Button>
		</div>
		<Separator class="my-4" />
		<div class="flex items-center">
			<Button
				class="me-2"
				variant="outline"
				href={localizeHref(`/account/edit/${$formData.customDomain}`)}
				><Palette class="me-2 h-5 w-5" />{m.home_witty_piranha_peek()}</Button
			>
			{#if $queryResult.isSuccess}
				<Button variant="ghost" href={`https://${$formData.customDomain}`}
					>{$formData.customDomain} <SquareArrowUpRight class="ms-2 h-5 w-5" /></Button
				>
			{/if}
		</div>
	</form>
</FormWrapper>
