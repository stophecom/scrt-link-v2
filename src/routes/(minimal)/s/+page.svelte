<script lang="ts">
	import { onMount } from 'svelte';

	import { api } from '$lib/api';
	import Page from '$lib/components/layout/page/page.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { Secret } from '$lib/server/db/schema';
	import { createHash, decryptString } from '$lib/web-crypto';

	let status: 'initial' | 'preloading' | 'preview' | 'downloading' | 'done' | 'error' = 'initial';
	let error: string = '';
	let secret: string = '';

	onMount(async () => {
		status = 'preloading';

		try {
			// Extract fragment (Everything after #)
			const masterKey = window.location.hash.substring(1);
			if (!masterKey.length || masterKey.includes('?')) {
				throw new Error(`Invalid URL.`);
			}

			const secretIdReference = await createHash(masterKey);
			const { content } = await api<Pick<Secret, 'content'>>(`/secrets/${secretIdReference}`);

			secret = await decryptString(content, masterKey);
		} catch (e) {
			if (e instanceof Error) {
				error = e?.message;
			}
		}
		status = 'preview';
	});
</script>

<Page title="Shhh" lead={m.each_light_mare_bump()}>
	<div class="prose dark:prose-invert">
		Secret: {secret}
	</div>

	<div>Status: {status}</div>

	{#if error}
		<Alert class="my-6" title="Error" variant="destructive">{error}</Alert>
	{/if}
</Page>
