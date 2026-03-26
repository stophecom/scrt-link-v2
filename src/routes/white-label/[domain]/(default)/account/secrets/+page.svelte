<script lang="ts">
	import CreateSecret from '$lib/components/blocks/create-secret.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import SecretsCard from '../../../../../(app)/(default)/account/secrets-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<CreateSecret
	class="mb-6"
	cardTitle={m.witty_mealy_seal_kick()}
	form={data.secretForm}
	effectiveTier={data.ownerTier}
	hidePrimaryFeatureList
/>

<SecretsCard secrets={data.secrets} />
