<script lang="ts">
	import { MessageCircleQuestion, Sparkles } from '@lucide/svelte';

	import AndroidFrame from '$lib/components/blocks/android-frame.svelte';
	import FaqSection from '$lib/components/blocks/faq-section.svelte';
	import FeatureCard from '$lib/components/blocks/feature-card.svelte';
	import Hero from '$lib/components/blocks/hero.svelte';
	import PageWrapper from '$lib/components/blocks/page-wrapper.svelte';
	import SetupSteps from '$lib/components/blocks/setup-steps.svelte';
	import UseCasesSection from '$lib/components/blocks/use-cases-section.svelte';
	import WhiteLabelShowcase from '$lib/components/blocks/white-label-showcase.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Section } from '$lib/components/ui/section';
	import { businessTrustFeatures, whiteLabelDemoWebsite } from '$lib/data/app';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	const pricingHref = localizeHref('/pricing') + '?tab=business';
</script>

{#snippet ctaButtons()}
	<div class="sm:grid-cols-auto grid grid-rows-2 gap-2 sm:flex sm:grid-rows-none">
		<Button size="lg" variant="default" href={pricingHref}>
			<Sparkles class="me-2 h-4 w-4" />
			{m.early_keen_eagle_trial()}
		</Button>
		<Button size="lg" variant="outline" target="_blank" href={whiteLabelDemoWebsite}>
			{m.business_cta_live_example()}
		</Button>
	</div>
{/snippet}

{#snippet cta()}
	{@render ctaButtons()}
	<p class="text-muted-foreground mt-3 text-sm">{m.business_cta_start_trial_note()}</p>
{/snippet}

<PageWrapper
	metaTitle={m.day_maroon_poodle_slurp()}
	metaDescription={m.basic_gaudy_cat_thrive()}
	metaKeywords={m.odd_fuzzy_bulldog_flip()}
>
	<Hero
		overline={m.business_hero_overline()}
		title={m.business_hero_title()}
		lead={m.business_hero_pitch()}
		class="pt-12"
		{cta}
	>
		<AndroidFrame class="origin-top max-sm:scale-40">
			<video autoplay loop muted>
				<source src="/videos/br3f-demo.mp4" type="video/mp4" />
			</video>
		</AndroidFrame>
	</Hero>

	<Section
		wide
		variant="card"
		title={m.business_customize_title()}
		lead={m.business_customize_lead()}
	>
		<WhiteLabelShowcase />

		<div class="mt-8">
			{@render ctaButtons()}
		</div>
	</Section>

	<Section variant="muted" wide title={m.business_setup_title()} lead={m.business_setup_lead()}>
		<SetupSteps />

		<div class="mt-8 flex flex-wrap items-center gap-2">
			<Button size="lg" variant="default" href={pricingHref}>
				<Sparkles class="me-2 h-4 w-4" />
				{m.early_keen_eagle_trial()}
			</Button>
		</div>
	</Section>

	<Section wide title={m.business_security_title()} lead={m.business_security_lead()}>
		<IntersectionObserver top={-50} once={true}>
			{#snippet children(intersecting)}
				<div class="grid grid-rows-4 gap-4 sm:grid-cols-2 sm:grid-rows-2">
					{#each businessTrustFeatures() as step, i (i)}
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

	<UseCasesSection />

	<FaqSection />

	<Section
		wide
		Icon={MessageCircleQuestion}
		variant="contrast"
		title={m.same_tidy_macaw_sail()}
		lead={m.least_gross_midge_thrive()}
	>
		<div class="flex flex-wrap gap-2">
			<Button
				size="lg"
				href={pricingHref}
				class="bg-background text-foreground hover:bg-background/90"
			>
				<Sparkles class="me-2 h-4 w-4" />
				{m.early_keen_eagle_trial()}
			</Button>
			<Button size="lg" variant="outline" href={localizeHref('/contact')}>
				{m.acidic_extra_vulture_enchant()}
			</Button>
		</div>
	</Section>
</PageWrapper>
