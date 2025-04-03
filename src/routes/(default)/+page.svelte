<script lang="ts">
	import ArrowRight from 'lucide-svelte/icons/arrow-right';

	import Burn from '$lib/assets/images/illustrations/burn.svg?component';
	import Write from '$lib/assets/images/illustrations/create.svg?component';
	import Share from '$lib/assets/images/illustrations/share.svg?component';
	import UrlExplained from '$lib/assets/images/illustrations/url-explained.svg?component';
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import Section from '$lib/components/elements/section.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import Page from '$lib/components/page/page.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

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
		class="grid grid-cols-[33%_1fr] grid-rows-2 gap-2 px-4! !py-0 ps-0! sm:grid-cols-none sm:grid-rows-[min-content_min-content_1fr]  sm:py-6! sm:ps-4! sm:text-center"
	>
		<h4 class="xs:text-2xl order-2 self-end text-xl font-bold sm:order-1 sm:mb-4 sm:text-2xl">
			{iterator + 1}. {title}
		</h4>
		<Illustration class="order-1 row-span-2 sm:order-2 sm:row-span-1" />
		<p class="xs:text-sm order-3 text-xs font-semibold sm:order-3">
			{description}
		</p>
	</Card>
{/snippet}

<Page title={m.lucky_warm_mayfly_engage()} lead={m.aloof_quaint_snail_pave()}>
	<div class="mb-12">
		<CreateSecret form={data.secretForm} user={data.user} />
	</div>
	<Section title={m.full_minor_fireant_accept()} lead={m.dirty_bright_robin_earn()}>
		<IntersectionObserver let:intersecting top={-100} once={true}>
			<div class="grid grid-rows-3 gap-4 sm:grid-cols-3 sm:grid-rows-none">
				{#each explanationSteps() as step, i}
					<div
						style="transition-delay: {i * 100}ms;"
						class="flex transition-all {intersecting
							? 'translate-y-0 scale-100 opacity-100 duration-700'
							: 'translate-y-20 scale-90 opacity-0'}"
					>
						{@render illustrationCards(step.title, step.illustration, step.description, i)}
					</div>
				{/each}
			</div>
		</IntersectionObserver>
	</Section>

	<Section title={m.flat_zany_baboon_adapt()} lead={m.royal_odd_ox_read()}>
		<IntersectionObserver let:intersecting top={-100} once={true}>
			<div
				class="flex transition-all {intersecting
					? 'translate-y-0 opacity-100 duration-500'
					: 'translate-y-10 opacity-0'}"
			>
				<Card class="mb-2">
					<UrlExplained />
					{m.equal_elegant_herring_yell()}
				</Card>
			</div>
		</IntersectionObserver>
		<Button variant="ghost" href={localizeHref('/security')}
			>{m.happy_plain_panther_fry()}<ArrowRight class="ms-2 h-4 w-4" /></Button
		>
	</Section>

	<Section title={m.few_awful_chipmunk_trust()} lead={m.stock_keen_marten_commend()}>
		<Accordion items={shortFaq()} />

		<Button href={localizeHref('/faq')}>{m.white_top_warbler_buzz()}</Button>
	</Section>
</Page>
