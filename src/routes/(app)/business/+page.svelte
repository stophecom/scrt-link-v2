<script lang="ts">
	import { Code } from 'lucide-svelte';

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
	import { shortFaq } from '$lib/data/faq';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#snippet cta()}
	<div>
		<Button class="me-2" size="lg" variant="default" target="_blank" href="https://br3f.com"
			>Visit demo page</Button
		>
		<Button size="lg" variant="outline" href={localizeHref('/')}>Design yours</Button>
	</div>
{/snippet}

<PageWrapper metaTitle={'foo'} metaDescription={'sdf'} metaKeywords={'sdf'}>
	<Hero
		title={'Secure sharing infrastructure for businesses'}
		lead={'Zero-trust architecture for sharing sensitive information with one-time links that self-destruct after viewing.'}
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
		title="Business features"
		lead="Security and privacy for confidential data you share within your company."
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

	<Section wide variant="card" title="Integrate with ease" lead="Developer first">
		<ApiPreview />

		<Button href={localizeHref('/developers')}
			><Code class="me-2 h-4 w-4" /> View API-Documentation</Button
		>
	</Section>

	<Section
		wide
		title="Security"
		lead={`Our philosophy is "the less we know, the better." We assume that no entity (internal or external) is inherently trustworthy. This simple principle is at the heart of our project, allowing you to exchange information online in a truly secure and private way.`}
	>
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
			><Code class="me-2 h-4 w-4" /> More about security</Button
		>
	</Section>

	<Section wide title={'How it works'} lead={m.dirty_bright_robin_earn()}>
		<HowItWorks />
		<div class="pt-4">
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'lg' })}
					>Try yourself</Dialog.Trigger
				>
				<Dialog.Content class="">
					<Dialog.Header>
						<Dialog.Title>Create secret</Dialog.Title>
					</Dialog.Header>
					<CreateSecret form={data.secretForm} user={data.user} hideUsps />
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</Section>

	<Section wide title={m.few_awful_chipmunk_trust()} lead={m.stock_keen_marten_commend()}>
		<Accordion items={shortFaq()} />

		<Button href={localizeHref('/faq')}>{m.white_top_warbler_buzz()}</Button>
	</Section>

	<Section wide variant="contrast" title={'Still undecided?'} lead={'Schedule a call'}
		>// contact</Section
	>
</PageWrapper>
