<script lang="ts">
	import { Trash } from '@lucide/svelte';

	import { enhance } from '$app/forms';
	import PageTitle from '$lib/components/blocks/page-title.svelte';
	import UpgradeNotice from '$lib/components/blocks/upgrade-notice.svelte';
	import ApiTokenForm from '$lib/components/forms/api-token-form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card';
	import CopyButton from '$lib/components/ui/copy-button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { getUserPlanLimits } from '$lib/data/plans';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { LayoutData } from '../$types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let activeTokens = $derived(data.apiTokens);
	let planLimits = $derived(getUserPlanLimits(data.user?.subscriptionTier));
</script>

<PageTitle title={m.super_funny_jackal_pause()} />

<Card class="mb-6" title={m.super_funny_jackal_pause()} description={m.patchy_swift_fish_cuddle()}>
	{#if planLimits.apiAccess}
		<h3 class="mt-6 text-xl font-semibold">{m.actual_keen_rooster_find()}</h3>
		<ApiTokenForm user={data.user} form={data.apiKeyForm} />

		{#if data.apiKeys.length}
			<h3 class="mt-6 mb-2 text-xl font-semibold">{m.lost_slimy_pelican_achieve()}</h3>
			{#each data.apiKeys as item, i (i)}
				<div
					class="bg-background/60 border-border mb-3 grid grid-cols-[100px_1fr] gap-2 overflow-hidden border p-2 px-4 sm:grid-cols-[100px_1fr_min-content_min-content]"
				>
					<div
						class="max-w-full items-center justify-center self-center justify-self-start truncate text-sm"
					>
						{item.description}
					</div>
					<Input type="text" value={item.key} disabled />
					<div class="col-span-2 flex justify-end">
						<CopyButton variant="ghost" text={item.key}></CopyButton>

						<form class="flex justify-center" method="post" use:enhance action="?/revokeAPIToken">
							<input type="hidden" name="keyId" value={item.id} />
							<Button type="submit" variant="ghost" class="text-destructive"
								><Trash class="me-2 h-4 w-4" />{m.tense_spicy_jannes_hug()}</Button
							>
						</form>
					</div>
				</div>
			{/each}
		{/if}
	{:else}
		<UpgradeNotice user={data.user} />
	{/if}

	<Separator class="my-6" />

	<Button variant="outline" href={localizeHref('/developers')}
		>{m.deft_bright_insect_attend()}</Button
	>
</Card>
