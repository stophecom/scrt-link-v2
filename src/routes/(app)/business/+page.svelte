<script lang="ts">
	import { Code, Lock, MessageCircleQuestion } from 'lucide-svelte';

	import AndroidFrame from '$lib/components/elements/android-frame.svelte';
	import ApiPreview from '$lib/components/elements/api-preview.svelte';
	import CreateSecret from '$lib/components/elements/create-secret.svelte';
	import FeatureCard from '$lib/components/elements/feature-card.svelte';
	import Hero from '$lib/components/elements/hero.svelte';
	import HowItWorks from '$lib/components/elements/how-it-works.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import PageWrapper from '$lib/components/page/page-wrapper.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Section } from '$lib/components/ui/section';
	import { businessFeatures, securityFeatures } from '$lib/data/app';
	import business from '$lib/data/faq/business';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#snippet cta()}
	<div>
		<Button class="me-2" size="lg" variant="default" href={localizeHref('/pricing')}
			>{m.happy_left_llama_pout()}</Button
		>
		<Button size="lg" variant="outline" target="_blank" href="https://br3f.com"
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
		<AndroidFrame>
			<video autoplay loop muted>
				<source src="/videos/scrt-link-blue-short.mp4" type="video/mp4" />
			</video>
		</AndroidFrame>
	</Hero>

	<Section
		wide
		variant="neutral"
		title={m.tense_pretty_finch_spur()}
		lead={m.fuzzy_patchy_flamingo_hike()}
	>
		<IntersectionObserver let:intersecting top={-50} once={true}>
			<div
				class="grid grid-rows-6 gap-4 sm:grid-cols-2 sm:grid-rows-3 md:grid-cols-3 md:grid-rows-2"
			>
				{#each businessFeatures() as step, i}
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

	<Section
		wide
		variant="card"
		title={m.aloof_minor_flamingo_nourish()}
		lead={m.mellow_lost_dragonfly_dance()}
	>
		<ApiPreview />

		<Button href={localizeHref('/developers')}
			><Code class="me-2 h-4 w-4" /> {m.this_sleek_toucan_radiate()}</Button
		>
	</Section>

	<Section wide title={m.alert_fluffy_snail_fetch()} lead={m.bright_steep_racoon_accept()}>
		<IntersectionObserver let:intersecting top={-50} once={true}>
			<div class="grid grid-rows-4 gap-4 sm:grid-cols-2 sm:grid-rows-2">
				{#each securityFeatures() as step, i}
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
		<div class="mb-6 max-w-prose">
			<HowItWorks />
		</div>
		<div class="self-center">
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'lg' })}
					>{m.vexed_brief_mouse_dream()}</Dialog.Trigger
				>
				<Dialog.Content class="">
					<Dialog.Header>
						<Dialog.Title>{m.arable_proof_ladybug_drip()}</Dialog.Title>
					</Dialog.Header>
					<CreateSecret form={data.secretForm} user={data.user} hideUsps />
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</Section>

	<Section wide title={m.few_awful_chipmunk_trust()} lead={m.stock_keen_marten_commend()}>
		<Accordion items={business()} />

		<Button variant="outline" href={localizeHref('/faq')}>{m.inner_known_mare_breathe()}</Button>
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
</PageWrapper>
