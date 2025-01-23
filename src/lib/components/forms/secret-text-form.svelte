<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Reply from 'lucide-svelte/icons/reply';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { expiresAtOptions } from '$lib/data/secretSettings';
	import * as m from '$lib/paraglide/messages.js';
	import { type SecretTextFormSchema, secretTextFormSchema } from '$lib/validators/formSchemas';
	import { encryptString, generateRandomUrlSafeString, sha256Hash } from '$lib/web-crypto';

	import type { LayoutData } from '../../../routes/$types';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import Input from '../ui/input/input.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import Toggle from '../ui/toggle/toggle.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<Infer<SecretTextFormSchema>>;
		baseUrl: LayoutData['baseUrl'];
	};

	let { baseUrl, form: formProp }: Props = $props();

	const CHARACTER_LIMIT = 150;

	let link: string = $state('');

	const form = superForm(formProp, {
		validators: zodClient(secretTextFormSchema(CHARACTER_LIMIT)),
		validationMethod: 'onblur',
		dataType: 'json',

		onSubmit: async ({ jsonData }) => {
			const { text, password } = $formData;

			const masterKey = generateRandomUrlSafeString();
			link = `${baseUrl}/s#${masterKey}`;

			// Encrypt secret text before submitting
			let encryptedText = text;
			if (password) {
				encryptedText = await encryptString(encryptedText, password);
			}
			encryptedText = await encryptString(encryptedText, masterKey);

			// Set data to be posted
			const jsonPayload = {
				secretIdHash: await sha256Hash(masterKey),
				meta: 'type=text',
				text: encryptedText,
				password: $formData.password
			};

			jsonData(jsonPayload);
		},

		onError({ result }) {
			// We use message for unexpected errors
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'Some error'
			};
		}
	});

	const { form: formData, message, delayed, constraints, enhance } = form;

	let charactersLeft = $derived(CHARACTER_LIMIT - $formData.text.length);

	let isOptionsVisible = $state(true);
</script>

{#if $message?.status === 'success'}
	<Alert title="Your secret link:" variant="success" class="mb-2">
		<div class="flex items-center">
			<div>
				<div class="font-light">{link}</div>
				<small class="block text-muted-foreground">Expires: 123.</small>
			</div>
			<CopyButton class="ml-auto shrink-0" text={link} />
		</div>
	</Alert>
	<Button href="/" variant="secondary" size="sm"
		><Reply class="mr-2 h-4 w-4" />Create another secret</Button
	>
{:else}
	<FormWrapper message={$message}>
		<form method="POST" use:enhance>
			<Form.Field {form} name="text" class="pt-2">
				<Form.Control>
					<Form.Label class="sr-only">{m.mellow_lime_squid_urge()}</Form.Label>
					<div class="relative">
						<Textarea
							class="resize-none"
							bind:value={$formData.text}
							{...$constraints.text}
							placeholder="What is your secret?"
						/>
						<span
							class="absolute bottom-1 right-1 text-xs {charactersLeft < 0
								? 'text-destructive'
								: 'text-muted-foreground'}">{charactersLeft}</span
						>
					</div>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div
				class="overflow-y-clip transition-all duration-300 ease-in-out {isOptionsVisible
					? 'visible h-[calc(auto)] opacity-100'
					: 'invisible h-0 opacity-0'}"
			>
				<Form.Field {form} name="password" class="py-2">
					<Form.Control let:attrs>
						<Form.Label class="sr-only">{m.yummy_fair_gazelle_link()}</Form.Label>
						<Input
							type="password"
							placeholder={m.yummy_fair_gazelle_link()}
							autocomplete="new-password"
							{...attrs}
							bind:value={$formData.password}
							{...$constraints.password}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="px-1 py-4">
					<Form.Fieldset {form} name="expiresAt" class="py-2">
						<Form.Legend>Link expiration</Form.Legend>
						<RadioGroup.Root bind:value={$formData.expiresAt} orientation="horizontal" class="flex">
							{#each expiresAtOptions() as option}
								<div class="flex items-center pe-3">
									<Form.Control let:attrs>
										<RadioGroup.Item value={option.value} {...attrs} />
										<Form.Label class="ml-0 cursor-pointer pl-2 font-normal"
											>{option.label}</Form.Label
										>
									</Form.Control>
								</div>
							{/each}
						</RadioGroup.Root>
						<Form.FieldErrors />
					</Form.Fieldset>
				</div>
			</div>

			<div class="flex items-start py-2">
				<Toggle size="sm" bind:pressed={isOptionsVisible} aria-label="Toggle options"
					>{isOptionsVisible ? m.teal_wide_owl_arise() : m.main_direct_salmon_savor()}
					<ChevronDown class="ml-2 h-4 w-4 {isOptionsVisible ? 'rotate-180' : ''}" /></Toggle
				>
				<Form.Button delayed={$delayed} class="ml-auto " size="lg"
					>{m.lazy_mealy_vole_harbor()}</Form.Button
				>
			</div>
		</form>
		{#if dev}
			<SuperDebug data={$formData} />
		{/if}
	</FormWrapper>
{/if}
