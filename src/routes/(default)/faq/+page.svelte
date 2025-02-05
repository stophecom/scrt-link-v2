<script lang="ts">
	import Page from '$lib/components/layout/page/page.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import { faq, faqCategories } from '$lib/data/faq';
	import * as m from '$lib/paraglide/messages.js';
</script>

<Page title="FAQ" lead={m.stock_keen_marten_commend()}>
	{#each faqCategories() as item}
		<h2 class="md:text-3xl mb-2 mt-20 text-2xl font-bold leading-snug">{item.title}</h2>

		{@const categoryFaq = faq().filter(({ category }) => category === item.id)}
		<Accordion items={categoryFaq} />
	{/each}
</Page>
