<script lang="ts">
	import { Code } from '@lucide/svelte';

	import ApiKeysCard from '$lib/components/blocks/api-keys-card.svelte';
	import UpgradeNotice from '$lib/components/blocks/upgrade-notice.svelte';
	import ApiTokenForm from '$lib/components/forms/api-token-form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import { getUserPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let planLimits = $derived(getUserPlanLimits(data.effectiveTier));
</script>

{#if planLimits.apiAccess}
	<Card
		class="mb-6"
		title={m.actual_keen_rooster_find()}
		description={m.patchy_swift_fish_cuddle()}
	>
		<ApiTokenForm form={data.apiKeyForm} />
	</Card>

	<ApiKeysCard class="mb-6" apiKeys={data.apiKeys} />
{:else}
	<UpgradeNotice tier={data.effectiveTier} class="mb-6" />
{/if}

<Button variant="outline" href={localizeHref('/api-documentation')}>
	<Code class="me-2 h-4 w-4" />
	{m.deft_bright_insect_attend()}
</Button>
