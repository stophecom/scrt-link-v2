<script lang="ts">
	import CreateSecret from '$lib/components/blocks/create-secret.svelte';
	import { WhiteLabelPage } from '$lib/components/page';
	import Markdown from '$lib/components/ui/markdown';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<WhiteLabelPage
	metaTitle={m.red_trite_turkey_flip()}
	title={data?.title || m.odd_swift_spider_tear()}
	lead={data?.lead || m.jumpy_alert_pig_expand()}
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
