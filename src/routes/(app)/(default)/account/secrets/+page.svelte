<script lang="ts">
	import CreateSecret from '$lib/components/blocks/create-secret.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import SecretsCard from '../secrets-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<CreateSecret
	class="mb-6"
	cardTitle={m.arable_proof_ladybug_drip()}
	form={data.secretForm}
	user={data.user}
	hidePrimaryFeatureList
/>

<SecretsCard secrets={data.secrets} />
