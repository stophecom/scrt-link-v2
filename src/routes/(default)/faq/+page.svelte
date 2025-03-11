<script lang="ts">
	import Page from '$lib/components/page/page.svelte';
	import Accordion from '$lib/components/ui/accordion';
	import * as m from '$lib/paraglide/messages.js';

	import { faq, faqCategories } from '../../../lib/data/faq';
</script>

<Page title="FAQ" lead={m.stock_keen_marten_commend()}>
	{#each faqCategories() as item}
		<h2 class="mt-20 mb-2 text-2xl leading-snug font-bold md:text-3xl">{item.title}</h2>

		{@const categoryFaq = faq().filter(({ category }) => category === item.id)}
		<Accordion items={categoryFaq} />
	{/each}
</Page>
