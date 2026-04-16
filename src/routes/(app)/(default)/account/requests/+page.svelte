<script lang="ts">
	import CreateSecretRequest from '$lib/components/blocks/create-secret-request.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import RequestsCard from '../requests-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Alert class="mb-6" variant="info" title={m.brave_clear_pug_greet()}>
	{m.calm_swift_elk_guide()}
</Alert>

<div class="mb-6">
	<CreateSecretRequest
		form={data.secretRequestForm}
		subscriptionTier={data.user?.subscriptionTier}
	/>
</div>

<RequestsCard requests={data.requests} unreadCount={data.unreadCount} />
