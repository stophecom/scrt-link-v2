<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';

	import Page from '$lib/components/page/default-page.svelte';
	import Container from '$lib/components/ui/container/container.svelte';
	import type { ComparisonCategory } from '$lib/data/comparisons';
	import { getComparisonsByCategory } from '$lib/data/comparisons';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	const categories: { key: ComparisonCategory; title: string }[] = [
		{ key: 'secret-sharing', title: m.alternatives_category_secret_sharing() },
		{ key: 'file-transfer', title: m.alternatives_category_file_transfer() },
		{ key: 'secure-email', title: m.alternatives_category_secure_email() }
	];
</script>

<Page
	title={m.alternatives_title()}
	lead={m.alternatives_lead()}
	metaTitle={m.alternatives_meta_title()}
	metaDescription={m.alternatives_meta_description()}
	metaKeywords={m.alternatives_meta_keywords()}
>
	<Container>
		{#each categories as category (category.key)}
			{@const comparisons = getComparisonsByCategory(category.key)}
			{#if comparisons.length}
				<section class="mb-10">
					<h2 class="font-display mb-2 text-2xl font-bold md:text-3xl">{category.title}</h2>
					<ul class="grid gap-4">
						{#each comparisons as comparison (comparison.slug)}
							<li>
								<a
									class="group border-border flex w-full rounded border-b transition-all"
									href={localizeHref(`/alternatives/${comparison.slug}`)}
								>
									<div class="rounded py-5 md:py-6">
										<h3 class="mb-2 text-xl font-bold text-pretty md:text-2xl">
											{comparison.title}
										</h3>

										<p class="text-lg text-pretty">{comparison.lead}</p>

										<div class="flex justify-between pt-4">
											<div
												class="text-primary after:bg-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out group-hover:after:origin-bottom-left group-hover:after:scale-x-100"
											>
												{m.alternatives_card_cta()}
											</div>
											<ArrowRight
												class="group-hover:text-primary -translate-x-4 opacity-0 transition-all delay-200 group-hover:translate-x-0 group-hover:opacity-100"
											/>
										</div>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		{/each}
	</Container>
</Page>
