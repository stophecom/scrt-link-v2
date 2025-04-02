<script lang="ts">
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { api } from '$lib/api';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import * as Form from '$lib/components/ui/form';
	import { m } from '$lib/paraglide/messages.js';
	import { type WhiteLabelSiteSchema, whiteLabelSiteSchema } from '$lib/validators/formSchemas';

	import type { DomainStatusResponse } from '../../../routes/api/v1/domain-status/[name]/+server';
	import Alert from '../ui/alert/alert.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<WhiteLabelSiteSchema>;
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
		validators: zodClient(whiteLabelSiteSchema()),

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
	<form method="POST" use:enhance action="?/saveWhiteLabelSite">
		<Form.Field {form} name="name">
			<Text label="Brand name" bind:value={$formData.name} {...$constraints.name} type="text" />
		</Form.Field>

		<Form.Field {form} name="customDomain">
			<Text
				label="Custom Domain"
				bind:value={$formData.customDomain}
				{...$constraints.customDomain}
				type="text"
			/>
			<Form.Description
				>Add a custom domain like example.com or secret.example.com.
			</Form.Description>
		</Form.Field>

		<Alert
			class="relative"
			title={$queryResult.data?.message}
			variant={$queryResult.data?.verified ? 'success' : 'default'}
		>
			<Spinner
				class="absolute top-5 right-5 h-4 w-4 transition-opacity {$queryResult.isFetching
					? 'opacity-100'
					: 'opacity-0'}"
			/>
			{#if !$queryResult.data?.verified}
				<div class="mb-4">Set the following record on your DNS provider to continue:</div>

				{#if $queryResult?.data?.instructions}
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

		<Form.Field {form} name="title">
			<Text label="Page title" bind:value={$formData.title} {...$constraints.title} type="text" />
		</Form.Field>
		<Form.Field {form} name="lead">
			<Text label="Page lead" bind:value={$formData.lead} {...$constraints.lead} type="text" />
		</Form.Field>

		<Form.Field {form} name="themeColor">
			<Text
				label="Theme color"
				bind:value={$formData.themeColor}
				{...$constraints.themeColor}
				type="color"
			/>
		</Form.Field>

		<Form.Button delayed={$delayed}>{m.caring_light_tiger_taste()}</Form.Button>
	</form>
</FormWrapper>
