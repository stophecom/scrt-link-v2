<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { faq, faqCategories } from '$lib/data/faq';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Page title={m.few_awful_chipmunk_trust()} lead={m.stock_keen_marten_commend()}>
	{#each faqCategories() as item}
		<h2 class="mt-20 mb-2 text-2xl leading-snug font-bold md:text-3xl">{item.title}</h2>

		{@const categoryFaq = faq().filter(({ category }) => category === item.id)}
		<Accordion items={categoryFaq} />
	{/each}
</Page>
