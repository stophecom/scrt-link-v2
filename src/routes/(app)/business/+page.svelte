<script lang="ts">
	import { Lock, MessageCircleQuestion } from '@lucide/svelte';

	import AndroidFrame from '$lib/components/blocks/android-frame.svelte';
	import CreateSecret from '$lib/components/blocks/create-secret.svelte';
	import FaqSection from '$lib/components/blocks/faq-section.svelte';
	import FeatureCard from '$lib/components/blocks/feature-card.svelte';
	import Hero from '$lib/components/blocks/hero.svelte';
	import HowItWorks from '$lib/components/blocks/how-it-works.svelte';
	import IntegrationSection from '$lib/components/blocks/integration-section.svelte';
	import PageWrapper from '$lib/components/blocks/page-wrapper.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Section } from '$lib/components/ui/section';
	import { businessFeatures, securityFeatures, whiteLabelDemoWebsite } from '$lib/data/app';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#snippet cta()}
	<div class="sm:grid-cols-auto grid grid-rows-2 gap-2 sm:flex sm:grid-rows-none">
		<Button size="lg" variant="default" href={localizeHref('/pricing')}
			>{m.early_keen_eagle_trial()}</Button
		>
		<Button size="lg" variant="outline" target="_blank" href={whiteLabelDemoWebsite}
			>{m.lower_fine_okapi_imagine()}</Button
		>
	</div>
{/snippet}

<PageWrapper
	metaTitle={m.day_maroon_poodle_slurp()}
	metaDescription={m.basic_gaudy_cat_thrive()}
	metaKeywords={m.odd_fuzzy_bulldog_flip()}
>
	<Hero
		title={m.topical_broad_falcon_kiss()}
		lead={m.raw_knotty_platypus_grasp()}
		class="pt-12"
		{cta}
	>
		<AndroidFrame class="origin-top max-sm:scale-50">
			<video autoplay loop muted>
				<source src="/videos/br3f-demo.mp4" type="video/mp4" />
			</video>
		</AndroidFrame>
	</Hero>

	<Section
		wide
		variant="neutral"
		title={m.tense_pretty_finch_spur()}
		lead={m.fuzzy_patchy_flamingo_hike()}
	>
		<IntersectionObserver top={-50} once={true}>
			{#snippet children(intersecting: boolean)}
				<div
					class="grid grid-rows-6 gap-4 sm:grid-cols-2 sm:grid-rows-3 md:grid-cols-3 md:grid-rows-2"
				>
					{#each businessFeatures() as step, i (i)}
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
			{/snippet}
		</IntersectionObserver>
	</Section>

	<IntegrationSection />

	<Section wide title={m.alert_fluffy_snail_fetch()} lead={m.bright_steep_racoon_accept()}>
		<IntersectionObserver top={-50} once={true}>
			{#snippet children(intersecting)}
				<div class="grid grid-rows-4 gap-4 sm:grid-cols-2 sm:grid-rows-2">
					{#each securityFeatures() as step, i (i)}
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
			{/snippet}
		</IntersectionObserver>

		<Button variant="outline" href={localizeHref('/security')}
			><Lock class="me-2 h-4 w-4" /> {m.mellow_ago_falcon_thrive()}</Button
		>
	</Section>

	<Section
		variant="muted"
		wide
		title={m.helpful_teary_earthworm_grasp()}
		lead={m.dirty_bright_robin_earn()}
	>
		<div class="mb-6 max-w-3xl">
			<HowItWorks />
		</div>
		<div class="flex">
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'lg' })}
					>{m.vexed_brief_mouse_dream()}</Dialog.Trigger
				>
				<Dialog.Content class="">
					<Dialog.Header>
						<Dialog.Title>{m.arable_proof_ladybug_drip()}</Dialog.Title>
					</Dialog.Header>
					<CreateSecret
						form={data.secretForm}
						effectiveTier={data.effectiveTier}
						hidePrimaryFeatureList
					/>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</Section>

	<FaqSection />

	<Section
		wide
		Icon={MessageCircleQuestion}
		variant="contrast"
		title={m.same_tidy_macaw_sail()}
		lead={m.least_gross_midge_thrive()}
	>
		<Button size="lg" href={localizeHref('/contact')}>{m.acidic_extra_vulture_enchant()}</Button>
	</Section>
</PageWrapper>
