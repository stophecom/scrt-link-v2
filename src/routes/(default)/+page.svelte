<script lang="ts">
	import Burn from '$lib/assets/images/illustrations/burn.svg?component';
	import Write from '$lib/assets/images/illustrations/create.svg?component';
	import Share from '$lib/assets/images/illustrations/share.svg?component';
	import CreateSecret from '$lib/components/layout/create-secret.svelte';
	import Page from '$lib/components/layout/page/page.svelte';
	import Section from '$lib/components/layout/section.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as m from '$lib/paraglide/messages.js';

	import { shortFaq } from '../../lib/data/faq';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const explanationSteps = () => [
		{
			title: m.topical_safe_mare_tap(),
			illustration: Write,
			description: m.petty_any_eel_fulfill()
		},
		{
			title: m.sunny_house_raven_pat(),
			illustration: Share,
			description: m.dark_brief_donkey_pick()
		},
		{
			title: m.smug_suave_niklas_peel(),
			illustration: Burn,
			description: m.main_small_niklas_treasure()
		}
	];
</script>

{#snippet illustrationCards(
	title: string,
	Illustration: typeof Write,
	description: string,
	iterator: number
)}
	<Card
		class="grid grid-cols-[36%_1fr]  grid-rows-2 gap-2 px-4! !py-0 sm:grid-cols-none sm:grid-rows-none sm:py-6! sm:text-center"
	>
		<h4 class="xs:text-2xl order-2 self-end text-xl font-bold sm:order-1 sm:mb-4 sm:text-3xl">
			{iterator + 1}. {title}
		</h4>
		<Illustration class="order-1 row-span-2 sm:order-2" />
		<p class="xs:text-sm order-3 text-xs font-semibold sm:order-3">
			{description}
		</p>
	</Card>
{/snippet}

<Page title={m.lucky_warm_mayfly_engage()} lead={m.aloof_quaint_snail_pave()}>
	<div class="mb-12">
		<CreateSecret form={data.secretForm} user={data.user} baseUrl={data.baseUrl} />
	</div>
	<Section title={m.full_minor_fireant_accept()} lead={m.dirty_bright_robin_earn()}>
		<div class="grid grid-rows-3 gap-4 sm:grid-cols-3 sm:grid-rows-none">
			{#each explanationSteps() as step, i}
				{@render illustrationCards(step.title, step.illustration, step.description, i)}
			{/each}
		</div>
	</Section>

	<Section title="FAQ" lead={m.stock_keen_marten_commend()}>
		<Accordion items={shortFaq()} />

		<Button href="/faq">{m.white_top_warbler_buzz()}</Button>
	</Section>
</Page>
