<script lang="ts">
	import CreateSecret from '$lib/components/blocks/create-secret.svelte';
	import { WhiteLabelPage } from '$lib/components/page';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<WhiteLabelPage
	metaTitle={m.active_polite_manatee_support()}
	title={data?.title || m.lucky_warm_mayfly_engage()}
	lead={data?.lead || m.bland_spicy_penguin_fade()}
>
	<div class="mb-12">
		<CreateSecret
			form={data.secretForm}
			effectiveTier={data.user ? data.ownerTier : null}
			hidePrimaryFeatureList
			secretTypes={data.enabledSecretTypes}
		/>
	</div>

	{#if data?.description}
		<Markdown format={true} markdown={data.description} />
	{/if}
</WhiteLabelPage>
