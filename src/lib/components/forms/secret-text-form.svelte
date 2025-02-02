<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import LockKeyhole from 'lucide-svelte/icons/lock-keyhole';
	import Reply from 'lucide-svelte/icons/reply';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import { getExpiresAtOptions } from '$lib/data/secretSettings';
	import * as m from '$lib/paraglide/messages.js';
	import { type SecretTextFormSchema, secretTextFormSchema } from '$lib/validators/formSchemas';
	import { encryptString, generateRandomUrlSafeString, sha256Hash } from '$lib/web-crypto';

	import type { LayoutData, LayoutServerData } from '../../../routes/$types';
	import Password from '../form-fields/password.svelte';
	import RadioGroup from '../form-fields/radio-group.svelte';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import Link from '../ui/link';
	import Markdown from '../ui/markdown';
	import Textarea from '../ui/textarea/textarea.svelte';
	import Toggle from '../ui/toggle/toggle.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<Infer<SecretTextFormSchema>>;
		baseUrl: LayoutData['baseUrl'];
		user: LayoutServerData['user'];
	};

	let { baseUrl, form: formProp, user }: Props = $props();

	const CHARACTER_LIMIT = 150;

	let link: string = $state('');

	const form = superForm(formProp, {
		validators: zodClient(secretTextFormSchema(CHARACTER_LIMIT)),
		validationMethod: 'onblur',
		dataType: 'json',

		onSubmit: async ({ jsonData }) => {
			const { text, password, expiresAt } = $formData;

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
				expiresAt,
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

	let isOptionsVisible = $state(false);
</script>

{#if $message?.status === 'success'}
	<Alert title="Your secret link:" variant="success" class="mb-2">
		<div class="flex items-center">
			<div class="flex-shrink overflow-hidden pe-2">
				<div class="mb-1 truncate whitespace-pre font-normal">{link}</div>
				<small class="block opacity-90"><Markdown markdown={$message.description || ''} /></small>
			</div>
			<CopyButton class="ml-auto shrink-0" text={link} />
		</div>
	</Alert>
	<Button href="/" variant="secondary" size="sm"
		><Reply class="mr-2 h-4 w-4" />{m.trite_fun_starfish_ripple()}</Button
	>
{:else}
	<FormWrapper message={$message}>
		<form method="POST" use:enhance action="?/postSecret">
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
				{#if user}
					<Form.Field {form} name="password">
						<Password
							bind:value={$formData.password}
							autocomplete="new-password"
							{...$constraints.password}
						/>
					</Form.Field>

					<Form.Fieldset {form} name="expiresAt">
						<RadioGroup
							options={getExpiresAtOptions()}
							bind:value={$formData.expiresAt}
							label={m.noble_whole_hornet_evoke()}
						/>
					</Form.Fieldset>
				{:else}
					<div class="py-4">
						<Alert Icon={LockKeyhole} variant="info" title="There is more">
							<p>
								Add a password, set expiration date and more. <Link href="/signup">Sign up now</Link
								>
							</p>
						</Alert>
					</div>
				{/if}
			</div>

			<div class="flex items-start">
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
			<div class="py-4">
				<SuperDebug data={$formData} />
			</div>
		{/if}
	</FormWrapper>
{/if}
