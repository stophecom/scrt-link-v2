<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import LockKeyhole from 'lucide-svelte/icons/lock-keyhole';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { type Infer, intProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import { getExpiresInOptions } from '$lib/data/secretSettings';
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

	import type { LayoutServerData } from '../../../routes/$types';
	import FileUpload from '../form-fields/file-upload.svelte';
	import Password from '../form-fields/password.svelte';
	import RadioGroup from '../form-fields/radio-group.svelte';
	import Text from '../form-fields/text.svelte';
	import Textarea from '../form-fields/textarea.svelte';
	import Alert from '../ui/alert/alert.svelte';
	import Link from '../ui/link';
	import Toggle from '../ui/toggle/toggle.svelte';
	import FormWrapper from './form-wrapper.svelte';

	const CHARACTER_LIMIT = 100_000;

	export type SecretType = 'text' | 'file' | 'redirect' | 'snap';
	export type Meta = Partial<FileMeta> & {
		secretType: SecretType;
	};

	export type SecretFormProps = {
		form: SuperValidated<Infer<SecretTextFormSchema>>;
		user: LayoutServerData['user'];
		secretType: SecretType;
		successMessage?: string;
		masterPassword: string;
	};
	let {
		successMessage = $bindable(),
		masterPassword = $bindable(),
		form: formProp,
		user,
		secretType
	}: SecretFormProps = $props();

	const form = superForm(formProp, {
		validators: zodClient(secretFormSchema()),
		validationMethod: 'onblur',
		dataType: 'json',

		onSubmit: async ({ jsonData }) => {
			const { content, password, expiresIn, meta } = $formData;

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
				expiresIn: expiresIn,
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

	// We need to convert number (expiration timeout) to string, since radio input only supports string.
	const expiresInOptions = getExpiresInOptions().map((option) => ({
		...option,
		value: String(option.value)
	}));
	const expiresInProxy = intProxy(form, 'expiresIn'); // Cast string to number

	let privateKey: CryptoKey | undefined = $state();
	let publicKeyRaw: string;
	let isOptionsVisible = $state(false);
	let isFileUploading = $state(false);

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

	// @todo rethink this
	$effect(() => {
		successMessage = $message?.status === 'success' ? $message.description : undefined;
	});
</script>

<FormWrapper message={$message}>
	<form method="POST" use:enhance action="?/postSecret">
		{#if secretType === 'text'}
			<div in:fade>
				<Form.Field {form} name="content" class="flex min-h-32 flex-col justify-center">
					<Textarea
						bind:value={$formData.content}
						label={m.mellow_lime_squid_urge()}
						placeholder={m.tiny_mean_marmot_cheer()}
						isHiddenLabel
						{charactersLeft}
						{...$constraints.content}
					/>
				</Form.Field>
			</div>
		{/if}
		{#if ['file', 'snap'].includes(secretType) && privateKey}
			<div in:fade>
				<div class="min-h-32 py-2">
					<FileUpload
						{secretType}
						bind:content={$formData.content}
						bind:meta={$formData.meta}
						{masterPassword}
						{privateKey}
						bind:loading={isFileUploading}
						accept={secretType === 'snap' ? 'image/*' : undefined}
					/>

					{#if secretType === 'snap' && !isFileUploading && !$formData.content}
						<div class="text-muted-contrast p-1 text-center text-xs">
							{m.tired_inner_cougar_push()}
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if secretType === 'redirect'}
			<div in:fade>
				<Form.Field {form} name="content" class="flex min-h-32 flex-col justify-center">
					<Text
						bind:value={$formData.content}
						label="URL"
						isHiddenLabel={true}
						placeholder="https://example.com"
						description="The URL to get redirected to (one time)."
						type="url"
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

				<Form.Fieldset {form} name="expiresIn">
					<RadioGroup
						options={expiresInOptions}
						bind:value={$expiresInProxy}
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

		<div class="flex flex-col items-stretch sm:flex-row">
			<Toggle class="mb-1" bind:pressed={isOptionsVisible} aria-label="Toggle options"
				>{isOptionsVisible ? m.teal_wide_owl_arise() : m.main_direct_salmon_savor()}
				<ChevronDown class="ml-2 h-4 w-4 {isOptionsVisible ? 'rotate-180' : ''}" /></Toggle
			>
			<Form.Button delayed={$delayed} class="sm:ml-auto " disabled={isFileUploading}
				>{m.lazy_mealy_vole_harbor()}</Form.Button
			>
		</div>
	</form>
</FormWrapper>
