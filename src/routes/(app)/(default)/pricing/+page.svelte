<script lang="ts">
	import { MessageCircleQuestion } from '@lucide/svelte';

	import FeatureCard from '$lib/components/blocks/feature-card.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import Button from '$lib/components/ui/button/button.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { Section } from '$lib/components/ui/section';
	import { subscriptionFeatures } from '$lib/data/app';
	import accountAndBilling from '$lib/data/faq/accountAndBilling';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import PlanSelection from './plan-selection.svelte';

	let { data } = $props();
</script>

<Page
	wide
	title={m.moving_quaint_buzzard_trip()}
	lead={m.slimy_next_shad_fall()}
	metaDescription={m.extra_minor_lark_clip()}
	metaKeywords={m.vivid_hour_starfish_fear()}
	class="pb-0"
>
	<Container variant="wide" class="mb-6 sm:py-10">
		{#if data.plans}
			<PlanSelection plans={data.plans} user={data.user} subscription={data.subscription} />
		{/if}
	</Container>

	<Section wide variant="card">
		<IntersectionObserver let:intersecting top={-50} once={true}>
			<div class="grid grid-rows-3 gap-4 md:grid-cols-3 md:grid-rows-1">
				{#each subscriptionFeatures() as step, i (i)}
					<div
						style="transition-delay: {i * 100}ms;"
						class="flex transition-all {intersecting
							? 'translate-y-0 scale-100 opacity-100 duration-700'
							: 'translate-y-20 scale-90 opacity-0'}"
					>
						<FeatureCard Icon={step.icon} title={step.title} description={step.description} />
					</div>
				{/each}
			</div>
		</IntersectionObserver>
	</Section>

	<Section title={m.few_awful_chipmunk_trust()} lead={m.pretty_factual_piranha_hug()}>
		<Accordion items={accountAndBilling()} />
	</Section>

	<Section
		wide
		Icon={MessageCircleQuestion}
		variant="contrast"
		title={m.same_tidy_macaw_sail()}
		lead={m.least_gross_midge_thrive()}
	>
		<Button size="lg" href={localizeHref('/contact')}>{m.acidic_extra_vulture_enchant()}</Button>
	</Section>
</Page>
