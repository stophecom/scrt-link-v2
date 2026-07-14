<script lang="ts">
	import { ListCheck } from '@lucide/svelte';

	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import ContactCta from '$lib/components/blocks/contact-cta.svelte';
	import FaqSection from '$lib/components/blocks/faq-section.svelte';
	import FeatureCard from '$lib/components/blocks/feature-card.svelte';
	import Quote from '$lib/components/blocks/quote.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import { CenteredPage } from '$lib/components/page';
	import Button from '$lib/components/ui/button/button.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { Section } from '$lib/components/ui/section';
	import { subscriptionFeatures } from '$lib/data/app';
	import accountAndBilling from '$lib/data/faq/accountAndBilling';
	import { m } from '$lib/paraglide/messages.js';

	import ComparisonTable from './comparison-table.svelte';
	import PlanSelection from './plan-selection.svelte';

	let { data } = $props();
	let showBusiness = $state(page.url.searchParams.get('tab') === 'business');

	$effect(() => {
		const url = new URL(window.location.href);
		if (showBusiness) {
			url.searchParams.set('tab', 'business');
		} else {
			url.searchParams.delete('tab');
		}
		try {
			replaceState(url, {});
		} catch {
			// Router not yet initialized during hydration
		}
	});
</script>

<CenteredPage
	wide
	title={m.moving_quaint_buzzard_trip()}
	lead={m.stark_bold_pricing_lead()}
	metaDescription={m.extra_minor_lark_clip()}
	metaKeywords={m.vivid_hour_starfish_fear()}
	class="pb-0"
>
	<Container variant="wide" class="mb-6 sm:py-4">
		{#if data.plans}
			<PlanSelection
				plans={data.plans}
				user={data.user}
				subscription={data.subscription}
				orgSubscription={data.orgSubscription}
				orgId={data.orgId}
				orgName={data.orgName}
				bind:showBusiness
			/>
		{/if}
		<div class="flex justify-center">
			<Button size="sm" variant="outline" href="#compare-plans"
				><ListCheck class="me-2 h-4 w-4" /> {m.calm_thin_moth_view()}</Button
			>
		</div>
	</Container>

	<Section wide variant="card">
		<IntersectionObserver top={-50} once={true}>
			{#snippet children(intersecting)}
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
			{/snippet}
		</IntersectionObserver>
	</Section>

	<Section id="compare-plans" wide title={m.calm_thin_moth_view()}>
		<ComparisonTable {showBusiness} />
	</Section>

	<Section wide variant="card">
		<Quote
			text="Not every piece of information needs to be stored, tracked, or logged. Some messages are meant for one moment — and one moment only."
			author="Chris"
			role="Founder of scrt.link"
			showIcon={false}
		/>
	</Section>

	<FaqSection items={accountAndBilling()} />

	<ContactCta />
	<div class="flex flex-wrap items-center justify-center gap-2 py-3">
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"
			><rect width="24" height="24" rx="3" fill="#D52B1E" /><path
				d="M10.5 6h3v12h-3z"
				fill="#fff"
			/><path d="M6 10.5h12v3H6z" fill="#fff" /></svg
		>
		<small>{m.mild_warm_jay_sing()}</small>
	</div>
</CenteredPage>
