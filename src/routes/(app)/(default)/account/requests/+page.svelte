<script lang="ts">
	import CreateSecretRequest from '$lib/components/blocks/create-secret-request.svelte';
	import RequestsCard from '$lib/components/blocks/requests-card.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mb-6">
	<CreateSecretRequest form={data.secretRequestForm} subscriptionTier={data.effectiveTier} />
</div>

<RequestsCard requests={data.requests} unreadCount={data.unreadCount} />
