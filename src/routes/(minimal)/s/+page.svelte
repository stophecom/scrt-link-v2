<script lang="ts">
	import { onMount } from 'svelte';

	import { api } from '$lib/api';
	import RevealSecretForm from '$lib/components/forms/reveal-secret-form.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as m from '$lib/paraglide/messages.js';
	import { sha256Hash } from '$lib/web-crypto';

	import type { PageData } from './$types';
	let isLoading = $state(true);
	let error: string = $state('');

	let { data }: { data: PageData } = $props();

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

			secretIdHash = await sha256Hash(masterKey);
			const { isPasswordProtected } = await api<{ isPasswordProtected: boolean }>(
				`/secrets/${secretIdHash}`
			);

			showPasswordInput = isPasswordProtected;

			// secret = await decryptString(content, masterKey);
		} catch (e) {
			if (e instanceof Error) {
				error = e?.message;
			}
		} finally {
			isLoading = false;
		}
	});
</script>

<Page title={m.each_light_mare_bump()} lead="You received a secret.">
	{#if isLoading}
		<div class="flex min-h-48 items-center justify-center">
			<Spinner />
		</div>
	{:else if error}
		<Alert class="my-6" title="Error" variant="destructive">{error}</Alert>
	{:else}
		<RevealSecretForm form={data.form} {masterKey} {secretIdHash} {showPasswordInput} />
	{/if}
</Page>
