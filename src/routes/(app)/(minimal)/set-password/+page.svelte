<script lang="ts">
	import { onMount } from 'svelte';

	import { consumeSignupTracking } from '$lib/client/plausible';
	import { SetPasswordPage } from '$lib/components/page';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// New users land here right after signup — fire the one-off Signup event.
	onMount(consumeSignupTracking);
</script>

<SetPasswordPage
	encryptionEnabled={data.encryptionEnabled}
	isRecoveryFlow={data.isRecoveryFlow}
	keyStore={data.keyStore}
	form={data.form}
	encryptionForm={data.encryptionForm}
/>
