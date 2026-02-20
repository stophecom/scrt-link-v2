<script lang="ts">
	import Burn from '$lib/assets/images/illustrations/burn.svg?component';
	import Write from '$lib/assets/images/illustrations/create.svg?component';
	import Share from '$lib/assets/images/illustrations/share.svg?component';
	import { m } from '$lib/paraglide/messages.js';

	import IntersectionObserver from '../helpers/intersection-observer.svelte';
	import Card from '../ui/card/card.svelte';

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

<IntersectionObserver top={-100} once={true}>
	{#snippet children(intersecting)}
		<div class="grid grid-rows-3 gap-4 sm:grid-cols-3 sm:grid-rows-none">
			{#each explanationSteps() as step, i (step.title)}
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
	{/snippet}
</IntersectionObserver>
