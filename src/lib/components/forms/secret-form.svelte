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
	import type { FileMeta } from '$lib/file-transfer';
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
	import Text from '../form-fields/text.svelte';
	import Textarea from '../form-fields/textarea.svelte';
	import Alert from '../ui/alert/alert.svelte';
	import Button from '../ui/button/button.svelte';
	import CopyButton from '../ui/copy-button';
	import Link from '../ui/link';
	import Markdown from '../ui/markdown';
	import Toggle from '../ui/toggle/toggle.svelte';
	import FormWrapper from './form-wrapper.svelte';

	const CHARACTER_LIMIT = 150; // TBD

	export type SecretType = 'text' | 'file' | 'redirect' | 'snap';
	export type Meta = Partial<FileMeta> & {
		secretType: SecretType;
	};

	type Props = {
		form: SuperValidated<Infer<SecretTextFormSchema>>;
		baseUrl: LayoutData['baseUrl'];
		user: LayoutServerData['user'];
		secretType: SecretType;
	};
	let { baseUrl, form: formProp, user, secretType }: Props = $props();

	const form = superForm(formProp, {
		validators: zodClient(secretFormSchema()),
		validationMethod: 'onblur',
		dataType: 'json',

		onSubmit: async ({ jsonData }) => {
			const { content, password, expiresAt, meta } = $formData;

			// Encrypt secret before submitting
			let encryptedMeta =
				meta ||
				JSON.stringify({
					secretType: secretType
				});

			let encryptedContent = content;

			if (password) {
				encryptedMeta = await encryptString(encryptedMeta, password);
				encryptedContent = await encryptString(encryptedContent, password);
			}
			encryptedMeta = await encryptString(encryptedMeta, masterPassword);
			encryptedContent = await encryptString(encryptedContent, masterPassword);

			// Set data to be posted
			const jsonPayload: Infer<SecretTextFormSchema> = {
				secretIdHash: await sha256Hash(masterPassword),
				meta: encryptedMeta,

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

	let privateKey: CryptoKey | undefined = $state();
	let publicKeyRaw: string;
	let masterPassword: string = $state('');
	let isOptionsVisible = $state(false);
	let isFileUploading = $state(false);

	let link: string = $derived(`${baseUrl}/s#${masterPassword}`);
	let charactersLeft = $derived(CHARACTER_LIMIT - $formData.content.length);

	const setCryptoKeys = async () => {
		masterPassword = generateRandomUrlSafeString();
		const keyPair = await generateKeyPair();
		privateKey = keyPair.privateKey;
		publicKeyRaw = await exportPublicKey(keyPair.publicKey);
	};

	onMount(async () => {
		await setCryptoKeys();
	});
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
	<Button href="/" on:click={setCryptoKeys} variant="secondary" size="sm"
		><Reply class="mr-2 h-4 w-4" />{m.trite_fun_starfish_ripple()}</Button
	>
{:else}
	<FormWrapper message={$message}>
		<form method="POST" use:enhance action="?/postSecret">
			{#if ['file', 'snap'].includes(secretType) && privateKey}
				<div in:fade class="py-2">
					<FileUpload
						{secretType}
						bind:content={$formData.content}
						bind:meta={$formData.meta}
						{masterPassword}
						{privateKey}
						bind:loading={isFileUploading}
						accept={secretType === 'snap' ? 'image/*' : undefined}
					/>
					{#if secretType === 'snap'}
						<span class="p-1 text-sm text-muted-foreground">{m.tired_inner_cougar_push()}</span>
					{/if}
				</div>
			{/if}
			{#if secretType === 'text'}
				<Form.Field {form} name="content" class="pt-2">
					<div in:fade>
						<Textarea
							bind:value={$formData.content}
							label={m.mellow_lime_squid_urge()}
							placeholder={m.tiny_mean_marmot_cheer()}
							hideLabel
							{charactersLeft}
							{...$constraints.content}
						/>
					</div>
				</Form.Field>
			{/if}
			{#if secretType === 'redirect'}
				<Form.Field {form} name="content" class="pt-2">
					<div in:fade>
						<Text
							bind:value={$formData.content}
							label="URL"
							placeholder="https://example.com"
							description="The URL to get redirected to (one time)."
							type="url"
						/>
					</div>
				</Form.Field>
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
						<Alert Icon={LockKeyhole} variant="info" title={m.fair_red_warbler_bake()}>
							<p>
								{m.cool_spicy_gopher_earn()}
								<Link href="/signup">{m.mild_tangy_elk_scoop()}</Link>
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
				<Form.Button delayed={$delayed} class="ml-auto " size="lg" disabled={isFileUploading}
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
