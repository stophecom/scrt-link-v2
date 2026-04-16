<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import {
		encryptRequestNote,
		encryptResponseContent,
		exportPublicKeyJWK,
		generateRandomUrlSafeString,
		generateRSAKeyPair,
		sha256Hash,
		wrapPrivateKey
	} from '@scrt-link/core';
	import { onMount } from 'svelte';
	import { intProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	import { page } from '$app/state';
	import { getMasterKey, isKeyUnlocked } from '$lib/client/key-manager';
	import { plausible } from '$lib/client/plausible';
	import Textarea from '$lib/components/forms/form-fields/textarea.svelte';
	import * as Form from '$lib/components/ui/form';
	import type { TierOptions } from '$lib/data/enums';
	import { m } from '$lib/paraglide/messages.js';
	import {
		type SecretRequestFormSchema,
		secretRequestFormSchema
	} from '$lib/validators/formSchemas';

	import { getExpiresInOptions } from '../../data/secretSettings';
	import UpgradeNotice from '../blocks/upgrade-notice.svelte';
	import Toggle from '../ui/toggle/toggle.svelte';
	import RadioGroup from './form-fields/radio-group.svelte';
	import FormWrapper from './form-wrapper.svelte';

	type Props = {
		form: SuperValidated<SecretRequestFormSchema>;
		expirationOptions: number[];
		tier?: TierOptions | null;
		successMessage?: string;
		requestLink?: string;
	};

	let {
		form: formProp,
		expirationOptions,
		tier,
		successMessage = $bindable(''),
		requestLink = $bindable('')
	}: Props = $props();

	let noteText = $state('');
	let requestId = '';
	let isOptionsVisible = $state(false);
	let keysReady = $state(false);

	const sForm = superForm(formProp, {
		validators: zod4(secretRequestFormSchema()),
		dataType: 'json',
		applyAction: false,

		onSubmit: async ({ jsonData }) => {
			// Encrypt note if provided
			let encryptedNote: string | undefined;
			let encryptedNoteForOwner: string | undefined;
			let noteKey = '';
			if (noteText.trim()) {
				const result = await encryptRequestNote(noteText);
				encryptedNote = result.encryptedNote;
				noteKey = result.noteKey;

				// Also encrypt with Master Key so owner can read it back in dashboard
				const masterKey = getMasterKey();
				encryptedNoteForOwner = await encryptResponseContent(noteText, masterKey);
			}

			$formData.encryptedNote = encryptedNote;
			$formData.encryptedNoteForOwner = encryptedNoteForOwner;

			// Build the request link
			const hashFragment = noteKey ? `${requestId}|${noteKey}` : requestId;
			requestLink = `${page.url.origin}/r/${$formData.requestIdHash}#${hashFragment}`;

			if (plausible) {
				const { trackEvent } = plausible;
				trackEvent('SecretCreation', {
					props: {
						secretType: 'request',
						whiteLabelDomain: page.url.host,
						subscriptionTier: tier || 'none'
					}
				});
			}

			jsonData($formData);
		},

		onResult({ result }) {
			if (result.type === 'success' || result.type === 'redirect') {
				successMessage =
					result.type === 'success' ? (result.data?.form?.message?.description ?? '') : '';
			}
			if (result.type === 'failure') {
				const msg = result.data?.form?.message;
				if (msg) {
					$message = msg;
				}
			}
		},

		onError({ result }) {
			$message = {
				status: 'error',
				title: 'Unexpected error',
				description: result.error.message || 'Something went wrong'
			};
		}
	});

	const { form: formData, message, delayed, enhance } = sForm;

	const setCryptoKeys = async () => {
		if (!isKeyUnlocked()) return;

		try {
			const masterKey = getMasterKey();

			// Generate RSA key pair
			const keyPair = await generateRSAKeyPair();

			// Export public key as JWK string
			$formData.publicKey = await exportPublicKeyJWK(keyPair.publicKey);

			// Wrap private key with master key
			$formData.encryptedPrivateKey = await wrapPrivateKey(keyPair.privateKey, masterKey);

			// Generate request ID for URL
			requestId = generateRandomUrlSafeString(36);
			$formData.requestIdHash = await sha256Hash(requestId);

			keysReady = true;
		} catch {
			$message = {
				status: 'error',
				title: m.sad_arable_canary_mop(),
				description: 'Failed to initialize encryption keys. Please reload and try again.'
			};
		}
	};

	onMount(async () => {
		await setCryptoKeys();
	});

	const expiresInOptions = getExpiresInOptions(expirationOptions).map((option) => ({
		...option,
		value: String(option.value)
	}));
	const expiresInProxy = intProxy(sForm, 'expiresIn');
</script>

<FormWrapper message={$message}>
	<form method="POST" action="?/postSecretRequest" use:enhance>
		<Form.Field form={sForm} name="encryptedNote">
			<Textarea
				bind:value={noteText}
				label={m.soft_kind_swan_write()}
				placeholder={m.pale_quick_finch_hint()}
				rows={4}
			/>
		</Form.Field>

		<div
			class="overflow-y-clip transition-all duration-300 ease-in-out {isOptionsVisible
				? 'visible h-[calc(auto)] pb-4 opacity-100'
				: 'invisible h-0 opacity-0'}"
		>
			<Form.Fieldset form={sForm} name="expiresIn" class="space-y-1">
				<RadioGroup
					label={m.noble_whole_hornet_evoke()}
					options={expiresInOptions}
					bind:value={$expiresInProxy}
				/>
			</Form.Fieldset>
			{#if !expirationOptions.length}
				<UpgradeNotice {tier} />
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
			<Form.Button class="sm:ml-auto" delayed={$delayed} disabled={!keysReady}
				>{m.keen_bold_falcon_send()}</Form.Button
			>
		</div>
	</form>
</FormWrapper>
