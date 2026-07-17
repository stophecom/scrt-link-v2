<script lang="ts">
	import { Code, SparklesIcon } from '@lucide/svelte';

	import ApiKeysCard from '$lib/components/blocks/api-keys-card.svelte';
	import TeaserCard from '$lib/components/blocks/teaser-card.svelte';
	import ApiTokenForm from '$lib/components/forms/api-token-form.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import Link from '$lib/components/ui/link';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#if !data.hasApiAccess}
	<TeaserCard title={m.teaser_org_api_title()} description={m.teaser_org_api_description()}>
		{#snippet cta()}
			<Button href={localizeHref('/pricing') + '?tab=business'}>
				<SparklesIcon class="me-2 h-5 w-5" />
				{m.teaser_white_label_cta()}
			</Button>
		{/snippet}
	</TeaserCard>
{:else}
	{#if data.whiteLabelDomain}
		<Alert variant="info" class="mb-6" title={m.org_api_keys_domain_title()}>
			<p>{m.org_api_keys_domain_description({ domain: data.whiteLabelDomain })}</p>
		</Alert>
	{:else}
		<Alert variant="destructive" class="mb-6" title={m.org_api_keys_no_domain_title()}>
			<p>{m.org_api_keys_no_domain_description()}</p>
			<Link href={localizeHref(`/account/org/${data.org.id}/white-label`)}>
				{m.org_api_keys_no_domain_cta()}
			</Link>
		</Alert>
	{/if}

	<Card
		class="mb-6"
		title={m.actual_keen_rooster_find()}
		description={m.org_api_keys_card_description()}
	>
		<ApiTokenForm form={data.apiKeyForm} />
	</Card>

	<ApiKeysCard class="mb-6" apiKeys={data.apiKeys} organizationId={data.org.id} />

	<Button variant="outline" href={localizeHref('/api-documentation')}>
		<Code class="me-2 h-4 w-4" />
		{m.deft_bright_insect_attend()}
	</Button>
{/if}
