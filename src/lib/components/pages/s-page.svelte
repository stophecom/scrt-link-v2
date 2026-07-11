<script lang="ts">
	import { SECRET_ID_LENGTH, sha256Hash } from '@scrt-link/core';
	import { onMount } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';

	import { api } from '$lib/api';
	import RevealSecretForm from '$lib/components/forms/reveal-secret-form.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Card from '$lib/components/ui/card';
	import { Spinner } from '$lib/components/ui/spinner';
	import { m } from '$lib/paraglide/messages.js';
	import type { RevealSecretFormSchema } from '$lib/validators/formSchemas';

	let isLoading = $state(true);
	let error: string = $state('');
	// No secret link in the URL (e.g. white-label preview or direct navigation).
	let noSecretLink = $state(false);

	let { form }: { form: SuperValidated<RevealSecretFormSchema> } = $props();

	let masterKey = $state('');
	let secretIdHash = $state('');
	let showPasswordInput = $state(false);
	let remainingViews = $state(1);

	onMount(async () => {
		try {
			// Extract fragment (Everything after #)
			masterKey = window.location.hash.substring(1);
			if (!masterKey.length) {
				// No secret link provided — show a friendly placeholder instead of an error.
				noSecretLink = true;
				return;
			}
			if (masterKey.includes('?')) {
				throw new Error(`Invalid URL.`);
			}
			const secretIdSubstring = masterKey.substring(SECRET_ID_LENGTH);
			secretIdHash = await sha256Hash(secretIdSubstring);
			const { isPasswordProtected, remainingViews: rv } = await api<{
				isPasswordProtected: boolean;
				remainingViews: number;
			}>(`/secrets/${secretIdHash}`);

			showPasswordInput = isPasswordProtected;
			remainingViews = rv;
		} catch (e) {
			if (e instanceof Error) {
				error = e?.message;
			}
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="py-12">
	{#if isLoading}
		<div class="flex min-h-48 items-center justify-center">
			<Spinner />
		</div>
	{:else if noSecretLink}
		<Card>
			<p class="text-muted-foreground py-8 text-center">
				{m.white_label_reception_preview_placeholder()}
			</p>
		</Card>
	{:else if error}
		<Alert data-testid="alert-error" class="my-6" title="Error" variant="destructive">{error}</Alert
		>
	{:else}
		<RevealSecretForm {form} {masterKey} {secretIdHash} {showPasswordInput} {remainingViews} />
	{/if}
</div>
