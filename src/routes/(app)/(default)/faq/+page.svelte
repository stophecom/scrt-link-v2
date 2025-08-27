<script lang="ts">
	import Page from '$lib/components/page/default-page.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import Container from '$lib/components/ui/container/container.svelte';
	import { faq, faqCategories } from '$lib/data/faq';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page
	title={m.few_awful_chipmunk_trust()}
	lead={m.stock_keen_marten_commend()}
	metaDescription={m.silly_vivid_chipmunk_amuse()}
	metaKeywords={m.many_pink_opossum_tear()}
>
	<Container>
		{#each faqCategories() as item (item.id)}
			<h2 class="mt-20 mb-2 text-2xl leading-snug font-bold md:text-3xl">{item.title}</h2>

			{@const categoryFaq = faq().filter(({ category }) => category === item.id)}
			<Accordion items={categoryFaq} />
		{/each}
	</Container>
</Page>
