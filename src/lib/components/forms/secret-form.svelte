<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import LockKeyhole from 'lucide-svelte/icons/lock-keyhole';
	import Reply from 'lucide-svelte/icons/reply';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import { getExpiresAtOptions } from '$lib/data/secretSettings';
	import * as m from '$lib/paraglide/messages.js';
	import { secretFormSchema, type SecretTextFormSchema } from '$lib/validators/formSchemas';
	import {
		encryptString,
		exportPublicKey,
		generateKeyPair,
		generateRandomUrlSafeString,
		sha256Hash
	} from '$lib/web-crypto';

	import type { LayoutData, LayoutServerData } from '../../../routes/$types';
	import FileUpload from '../form-fields/file-upload.svelte';
	import Password from '../form-fields/password.svelte';
	import RadioGroup from '../form-fields/radio-group.svelte';
	import Textarea from '../form-fields/textarea.svelte';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import Link from '../ui/link';
	import Markdown from '../ui/markdown';
	import Toggle from '../ui/toggle/toggle.svelte';
	import FormWrapper from './form-wrapper.svelte';

	export type SecretType = 'text' | 'file' | 'redirect';

	type Props = {
		form: SuperValidated<Infer<SecretTextFormSchema>>;
		baseUrl: LayoutData['baseUrl'];
		user: LayoutServerData['user'];
		secretType: SecretType;
	};

	let { baseUrl, form: formProp, user, secretType }: Props = $props();

	let link: string = $state('');

	const CHARACTER_LIMIT = 150; // TBD
	const masterPassword = generateRandomUrlSafeString();

	let privateKey: CryptoKey | undefined = $state();
	let publicKeyRaw: string;

	onMount(async () => {
		const keyPair = await generateKeyPair();
		privateKey = keyPair.privateKey;
		publicKeyRaw = await exportPublicKey(keyPair.publicKey);
	});

	const form = superForm(formProp, {
		validators: zodClient(secretFormSchema(CHARACTER_LIMIT)),
		validationMethod: 'onblur',
		dataType: 'json',

		onSubmit: async ({ jsonData }) => {
			const { content, password, expiresAt } = $formData;

			if (secretType === 'file') {
				isUploading = true;
				console.log('file upload', $formData);
			}

			link = `${baseUrl}/s#${masterPassword}`;

			// Encrypt secret text before submitting
			let encryptedContent = content;
			if (password) {
				encryptedContent = await encryptString(encryptedContent, password);
			}
			encryptedContent = await encryptString(encryptedContent, masterPassword);

			// Set data to be posted
			const jsonPayload: Infer<SecretTextFormSchema> = {
				secretIdHash: await sha256Hash(masterPassword),
				meta: 'type=text',
				content: encryptedContent,
				publicKey: publicKeyRaw,
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

	let charactersLeft = $derived(CHARACTER_LIMIT - $formData.content.length);

	let isOptionsVisible = $state(false);
	let isUploading = $state(false);
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
			{#if secretType === 'file' && privateKey}
				<div in:fade class="py-2 pb-4">
					<FileUpload
						onUploadSuccess={({ meta, content }) => {
							$formData.meta = meta;
							$formData.content = content;
						}}
						{masterPassword}
						{privateKey}
						{isUploading}
					/>
				</div>
			{/if}

			{#if secretType === 'text'}
				<div in:fade>
					<Form.Field {form} name="content" class="pt-2">
						<Textarea
							bind:value={$formData.content}
							label={m.mellow_lime_squid_urge()}
							placeholder={m.tiny_mean_marmot_cheer()}
							hideLabel
							{charactersLeft}
							{...$constraints.content}
						/>
					</Form.Field>
				</div>
			{/if}

			<div
				class="overflow-y-clip transition-all duration-300 ease-in-out {isOptionsVisible
					? 'visible h-[calc(auto)] pb-4 opacity-100'
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
					<div class="py-2">
						<Alert Icon={LockKeyhole} variant="info" title="Please sign up">
							<p>
								Add a password, set expiration date, get read receipts and more. <Link
									href="/signup">Sign up now</Link
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
