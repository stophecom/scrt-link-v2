<script lang="ts">
	import { ArrowRight, ExternalLink } from '@lucide/svelte';

	import ComparisonTable from '$lib/components/blocks/comparison-table.svelte';
	import ContactCta from '$lib/components/blocks/contact-cta.svelte';
	import Page from '$lib/components/page/default-page.svelte';
	import Accordion from '$lib/components/ui/accordion/accordion-complete.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import Markdown from '$lib/components/ui/markdown/markdown.svelte';
	import { Section } from '$lib/components/ui/section';
	import { appName } from '$lib/data/app';
	import { formatDate } from '$lib/i18n';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data } = $props();

	const comparison = $derived(data.comparison);
</script>

<Page
	title={comparison.title}
	lead={comparison.lead}
	metaTitle={comparison.metaTitle}
	metaDescription={comparison.metaDescription}
	metaKeywords={comparison.metaKeywords}
	markNotTranslated
	wide
	class="pb-0"
>
	<Container variant="wide" class="pb-12">
		<div class="prose max-w-none">
			<Markdown markdown={comparison.summary} format />
		</div>
		<div class="flex flex-wrap gap-2 pt-4">
			<Button size="lg" href={localizeHref('/')}>Share a secret</Button>
			<Button variant="ghost" size="lg" href={comparison.website} target="_blank" rel="noopener">
				Visit {comparison.name}
				<ExternalLink class="ml-2 h-4 w-4" />
			</Button>
		</div>
	</Container>

	<Section wide variant="card" title="Feature comparison">
		<ComparisonTable competitorName={comparison.name} rows={comparison.features} />
		<p class="text-muted-foreground pt-6 text-sm">
			Facts about {comparison.name} last verified on {formatDate(
				new Date(comparison.lastVerified)
			)}. Products change — if something here is out of date,
			<a class="underline" href={localizeHref('/contact')}>let us know</a> and we'll fix it.
		</p>
	</Section>

	<Section wide title="Key differences">
		<div class="grid gap-8 md:grid-cols-2">
			{#each comparison.keyDifferences as difference (difference.title)}
				<div>
					<h3 class="mb-2 text-lg font-semibold">{difference.title}</h3>
					<div class="text-pretty">
						<Markdown markdown={difference.body} />
					</div>
				</div>
			{/each}
		</div>
	</Section>

	<Section wide variant="card" title="Which one should you use?">
		<div class="grid gap-8 md:grid-cols-2">
			<div>
				<h3 class="mb-3 text-lg font-semibold">Choose {appName} if…</h3>
				<ul class="grid gap-2">
					{#each comparison.chooseScrtLink as reason (reason)}
						<li class="grid grid-cols-[min-content_1fr] gap-2">
							<ArrowRight class="text-primary mt-1 h-4 w-4" />
							<span class="text-pretty"><Markdown markdown={reason} /></span>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<h3 class="mb-3 text-lg font-semibold">
					{comparison.chooseCompetitorTitle ?? `Choose ${comparison.name} if…`}
				</h3>
				<ul class="grid gap-2">
					{#each comparison.chooseCompetitor as reason (reason)}
						<li class="grid grid-cols-[min-content_1fr] gap-2">
							<ArrowRight class="text-muted-foreground mt-1 h-4 w-4" />
							<span class="text-pretty"><Markdown markdown={reason} /></span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</Section>

	<Section wide title="Frequently asked questions">
		<Accordion items={comparison.faq} jsonLd />
	</Section>

	<ContactCta />

	{#if data.otherComparisons.length}
		<Section wide title="Other comparisons">
			<ul class="flex flex-wrap gap-2">
				{#each data.otherComparisons as other (other.slug)}
					<li>
						<Button variant="outline" href={localizeHref(`/alternatives/${other.slug}`)}>
							{appName} vs {other.name}
						</Button>
					</li>
				{/each}
			</ul>
		</Section>
	{/if}
</Page>
