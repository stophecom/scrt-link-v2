<script lang="ts">
	import Reply from 'lucide-svelte/icons/reply';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import * as m from '$lib/paraglide/messages.js';
	import { type SecretTextFormSchema, secretTextFormSchema } from '$lib/validators/formSchemas';
	import { createHash, encryptString, generateRandomUrlSafeString } from '$lib/web-crypto';

	import type { LayoutData } from '../../../routes/$types';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import Input from '../ui/input/input.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
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
				secretIdHash: await createHash(masterKey),
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
</script>

{#if $message?.status === 'success'}
	<Alert title="Your secret link:" variant="success" class="mb-2">
		<div class="flex items-center">
			<div>
				<div class="font-light">{link}</div>
				<small class="block text-muted-foreground">Expires: sdfsdf</small>
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
			<Form.Field {form} name="text" class="py-2">
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

			<Form.Field {form} name="password" class="py-4">
				<Form.Control let:attrs>
					<Form.Label>{m.yummy_fair_gazelle_link()}</Form.Label>
					<Input
						type="password"
						autocomplete="new-password"
						{...attrs}
						bind:value={$formData.password}
						{...$constraints.password}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="py-4">
				<Form.Button delayed={$delayed} class="w-full" size="lg">Submit</Form.Button>
			</div>
		</form>
		<SuperDebug data={$formData} />
	</FormWrapper>
{/if}
