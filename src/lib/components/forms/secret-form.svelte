<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import {
		encryptString,
		exportPublicKey,
		generateKeyPair,
		generateRandomUrlSafeString,
		MASTER_PASSWORD_LENGTH,
		SECRET_ID_LENGTH,
		SecretType,
		sha256Hash
	} from '@scrt-link/core';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { intProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	import { page } from '$app/state';
	import { plausible } from '$lib/client/plausible';
	import Password from '$lib/components/forms/form-fields/password.svelte';
	import RadioGroup from '$lib/components/forms/form-fields/radio-group.svelte';
	import FileUpload from '$lib/components/forms/form-fields/secret-file-upload.svelte';
	import Text from '$lib/components/forms/form-fields/text.svelte';
	import Textarea from '$lib/components/forms/form-fields/textarea.svelte';
	import * as Form from '$lib/components/ui/form';
	import { getPlanLimits } from '$lib/data/plans';
	import type { FileMeta } from '$lib/file-transfer';
	import { m } from '$lib/paraglide/messages.js';
	import { type SecretFormSchema, secretFormSchema } from '$lib/validators/formSchemas';

	import { getExpiresInOptions } from '../../data/secretSettings';
	import UpgradeNotice from '../blocks/upgrade-notice.svelte';
	import Input from '../ui/input/input.svelte';
	import Label from '../ui/label/label.svelte';
	import Toggle from '../ui/toggle/toggle.svelte';
	import FormWrapper from './form-wrapper.svelte';

	export type Meta = Partial<FileMeta> & {
		secretType: SecretType;
		neogramDestructionTimer?: number;
	};

	export type SecretFormProps = {
		form: SuperValidated<SecretFormSchema>;
		user: App.Locals['user'];
		secretType: SecretType;
		successMessage?: string;
		masterKey: string;
	};
	let {
		successMessage = $bindable(),
		masterKey = $bindable(),
		form: formProp,
		user,
		secretType
	}: SecretFormProps = $props();

	let neogramDestructionTimer = $state(5);

	let planLimits = $derived(getPlanLimits(page.url.host, user?.subscriptionTier));

	const form = superForm(formProp, {
		validators: zod(secretFormSchema()),
		dataType: 'json',

		onSubmit: async ({ jsonData }) => {
			const { content, password, expiresIn, meta, secretIdHash, publicKey, publicNote } = $formData;

			// Encrypt secret before submitting
			let encryptedMeta =
				meta ||
				JSON.stringify({
					secretType: secretType,
					neogramDestructionTimer
				});

			let encryptedContent = content;

			if (password) {
				encryptedMeta = await encryptString(encryptedMeta, password);
				encryptedContent = await encryptString(encryptedContent, password);
			}
			encryptedMeta = await encryptString(encryptedMeta, masterKey);
			encryptedContent = await encryptString(encryptedContent, masterKey);

			// Set data to be posted
			const jsonPayload: SecretFormSchema = {
				secretIdHash,
				meta: encryptedMeta,
				content: encryptedContent,
				publicKey,
				publicNote,
				expiresIn,
				password
			};

			if (plausible) {
				const { trackEvent } = plausible;
				trackEvent('SecretCreation', {
					props: {
						secretType: secretType,
						whiteLabelDomain: page.url.host,
						withPassword: !!$formData.password,
						subscriptionTier: user?.subscriptionTier || 'none'
					}
				});
			}

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
	const expiresInOptions = getExpiresInOptions(planLimits.expirationOptions).map((option) => ({
		...option,
		value: String(option.value)
	}));
	const expiresInProxy = intProxy(form, 'expiresIn'); // Cast string to number

	let privateKey: CryptoKey | undefined = $state();

	let isOptionsVisible = $state(false);
	let isFileUploading = $state(false);

	let charactersLeft = $derived(planLimits.text - $formData.content.length);

	const isNeogramAllowed = $derived(secretType === SecretType.NEOGRAM && planLimits.neogram);
	const isSnapAllowed = $derived(secretType === SecretType.SNAP && planLimits.snap);

	let isButtonDisabled = $derived(
		isFileUploading ||
			((secretType === SecretType.FILE || secretType === SecretType.SNAP) && !$formData.content)
	);

	const setCryptoKeys = async () => {
		masterKey = generateRandomUrlSafeString(MASTER_PASSWORD_LENGTH);
		const keyPair = await generateKeyPair();
		privateKey = keyPair.privateKey;

		// Set initial formdata
		const secretIdSubstring = masterKey.substring(SECRET_ID_LENGTH);
		$formData.secretIdHash = await sha256Hash(secretIdSubstring);
		$formData.publicKey = await exportPublicKey(keyPair.publicKey);
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
		{#if secretType === SecretType.TEXT || secretType === SecretType.NEOGRAM}
			<div in:fade>
				<div class="min-h-32">
					{#if secretType === SecretType.TEXT || isNeogramAllowed}
						<Form.Field {form} name="content">
							<Textarea
								bind:value={$formData.content}
								label={m.mellow_lime_squid_urge()}
								placeholder={secretType === SecretType.NEOGRAM
									? m.wise_each_badger_borrow()
									: m.tiny_mean_marmot_cheer()}
								isHiddenLabel
								{charactersLeft}
								{...$constraints.content}
								maxlength={planLimits.text}
								data-testid="input-secret-content"
							/>
						</Form.Field>
					{/if}
					{#if charactersLeft <= 0 || (secretType === SecretType.NEOGRAM && !planLimits.neogram)}
						<div class="pt-2">
							<UpgradeNotice {user} />
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if [SecretType.FILE, SecretType.SNAP].includes(secretType) && privateKey}
			<div in:fade>
				<div class="min-h-32 py-2">
					{#if secretType === SecretType.FILE || isSnapAllowed}
						<FileUpload
							{secretType}
							bind:content={$formData.content}
							bind:meta={$formData.meta}
							{masterKey}
							{privateKey}
							maxFileSize={planLimits.file}
							bind:loading={isFileUploading}
							accept={secretType === SecretType.SNAP ? 'image/*' : undefined}
						/>

						{#if secretType === SecretType.SNAP && !isFileUploading && !$formData.content}
							<div class="text-muted-foreground p-1 text-center text-xs text-pretty">
								{m.tired_inner_cougar_push()}
							</div>
						{/if}
					{:else}
						<UpgradeNotice {user} />
					{/if}
				</div>
			</div>
		{/if}

		{#if secretType === SecretType.REDIRECT}
			<div in:fade>
				<div class="min-h-32 py-2">
					{#if planLimits.redirect}
						<Form.Field {form} name="content">
							<Text
								bind:value={$formData.content}
								label="URL"
								isHiddenLabel={true}
								placeholder="https://example.com"
								description={m.seemly_loud_falcon_pave()}
								type="url"
							/>
						</Form.Field>
					{:else}
						<UpgradeNotice {user} />
					{/if}
				</div>
			</div>
		{/if}

		<div
			class="overflow-y-clip transition-all duration-300 ease-in-out {isOptionsVisible
				? 'visible h-[calc(auto)] pb-4 opacity-100'
				: 'invisible h-0 opacity-0'}"
		>
			<Form.Field {form} name="password">
				<Password
					bind:value={$formData.password}
					autocomplete="new-password"
					{...$constraints.password}
					disabled={!planLimits.passwordAllowed}
				/>
			</Form.Field>

			<Form.Fieldset {form} name="expiresIn">
				<RadioGroup
					options={expiresInOptions}
					bind:value={$expiresInProxy}
					label={m.noble_whole_hornet_evoke()}
				/>
			</Form.Fieldset>

			{#if user}
				<Form.Field {form} name="publicNote">
					<Text
						label={m.only_basic_buzzard_kiss()}
						description={m.north_these_lemming_enchant()}
						placeholder={m.this_gaudy_skate_yell()}
						bind:value={$formData.publicNote}
						{...$constraints.publicNote}
					/>
				</Form.Field>
			{/if}

			{#if secretType === SecretType.NEOGRAM && isNeogramAllowed}
				<Label for="neogramCountdownTime">{m.due_super_halibut_snap()}</Label>
				<Input
					id="neogramCountdownTime"
					class="w-44"
					type="number"
					max="1000"
					bind:value={neogramDestructionTimer}
				/>
			{/if}

			{#if (!planLimits.expirationOptions.length || !planLimits.passwordAllowed) && !((secretType === SecretType.SNAP && !planLimits.snap) || (secretType === SecretType.NEOGRAM && !planLimits.neogram) || (secretType === SecretType.REDIRECT && !planLimits.redirect))}
				<UpgradeNotice {user} />
			{/if}
		</div>

		<div class="flex flex-col items-stretch sm:flex-row">
			<Toggle
				class="mb-1"
				bind:pressed={isOptionsVisible}
				aria-label={m.topical_zany_grebe_exhale()}
				>{isOptionsVisible ? m.teal_wide_owl_arise() : m.main_direct_salmon_savor()}
				<ChevronDown class="ml-2 h-4 w-4 {isOptionsVisible ? 'rotate-180' : ''}" /></Toggle
			>
			<Form.Button
				data-testid="secret-form-submit"
				delayed={$delayed || isFileUploading}
				class="sm:ml-auto "
				disabled={isButtonDisabled}>{m.lazy_mealy_vole_harbor()}</Form.Button
			>
		</div>
	</form>
</FormWrapper>
