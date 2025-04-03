<script lang="ts">
	import { onMount } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';

	import { api } from '$lib/api';
	import { SECRET_ID_LENGTH } from '$lib/client/constants';
	import { sha256Hash } from '$lib/client/web-crypto';
	import RevealSecretForm from '$lib/components/forms/reveal-secret-form.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import { m } from '$lib/paraglide/messages.js';
	import type { RevealSecretFormSchema } from '$lib/validators/formSchemas';

	let isLoading = $state(true);
	let error: string = $state('');

	let { form }: { form: SuperValidated<RevealSecretFormSchema> } = $props();

	let masterKey = $state('');
	let secretIdHash = $state('');
	let showPasswordInput = $state(false);

	onMount(async () => {
		try {
			// Extract fragment (Everything after #)
			masterKey = window.location.hash.substring(1);
			if (!masterKey.length || masterKey.includes('?')) {
				throw new Error(`Invalid URL.`);
			}
			const secretIdSubstring = masterKey.substring(SECRET_ID_LENGTH);
			secretIdHash = await sha256Hash(secretIdSubstring);
			const { isPasswordProtected } = await api<{ isPasswordProtected: boolean }>(
				`/secrets/${secretIdHash}`
			);

			showPasswordInput = isPasswordProtected;
		} catch (e) {
			if (e instanceof Error) {
				error = e?.message;
			}
		} finally {
			isLoading = false;
		}
	});
</script>

<Page title={m.each_light_mare_bump()} lead={m.warm_clean_horse_seek()}>
	{#if isLoading}
		<div class="flex min-h-48 items-center justify-center">
			<Spinner />
		</div>
	{:else if error}
		<Alert class="my-6" title="Error" variant="destructive">{error}</Alert>
	{:else}
		<RevealSecretForm {form} {masterKey} {secretIdHash} {showPasswordInput} />
	{/if}
</Page>
