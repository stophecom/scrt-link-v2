<script lang="ts">
	import { ListCheck, MessageCircleQuestionMark } from '@lucide/svelte';

	import FeatureCard from '$lib/components/blocks/feature-card.svelte';
	import Quote from '$lib/components/blocks/quote.svelte';
	import IntersectionObserver from '$lib/components/helpers/intersection-observer.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import Button from '$lib/components/ui/button/button.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import { Section } from '$lib/components/ui/section';
	import { githubUrl, subscriptionFeatures } from '$lib/data/app';
	import accountAndBilling from '$lib/data/faq/accountAndBilling';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	import ComparisonTable from './comparison-table.svelte';
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
		<ComparisonTable />
	</Section>

	<Section wide variant="muted">
		<Quote
			text="Not every piece of information needs to be stored, tracked, or logged. Some messages are meant for one moment — and one moment only."
			author="Chris"
			role="Founder of scrt.link"
			showIcon={false}
		/>
	</Section>

	<Section title={m.few_awful_chipmunk_trust()} lead={m.pretty_factual_piranha_hug()}>
		<Accordion items={accountAndBilling()} defaultOpen={[0]} />
	</Section>

	<div class="bg-muted flex flex-wrap items-center justify-center gap-2 py-3">
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none"
			><rect width="24" height="24" rx="3" fill="#D52B1E" /><path
				d="M10.5 6h3v12h-3z"
				fill="#fff"
			/><path d="M6 10.5h12v3H6z" fill="#fff" /></svg
		>
		<small>{m.mild_warm_jay_sing()}</small>
	</div>

	<Section
		wide
		Icon={MessageCircleQuestionMark}
		variant="contrast"
		title={m.same_tidy_macaw_sail()}
		lead={m.least_gross_midge_thrive()}
	>
		<div class="flex gap-2">
			<Button size="lg" href={localizeHref('/contact')}>{m.acidic_extra_vulture_enchant()}</Button>
			<Button variant="secondary" size="lg" href={githubUrl} target="_blank">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"
					><path
						d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"
					/></svg
				>
				<span class="ml-2">{m.neat_bold_ram_play()}</span>
			</Button>
		</div>
	</Section>
</Page>
