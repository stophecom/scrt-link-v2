<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { slide } from 'svelte/transition';

	import { stripMarkdown } from '$lib/client/utils';
	import Markdown from '$lib/components/ui/markdown';

	import Content from './accordion-content.svelte';
	import Item from './accordion-item.svelte';
	import Trigger from './accordion-trigger.svelte';

	type Props = {
		items: {
			heading: string;
			body: string;
		}[];
		defaultOpen?: number[];
		jsonLd?: boolean;
	};
	let { items, defaultOpen = [], jsonLd = false }: Props = $props();

	const jsonLdHtml = $derived.by(() => {
		if (!jsonLd) return null;
		const payload = JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: items.map((item) => ({
				'@type': 'Question',
				name: stripMarkdown(item.heading),
				acceptedAnswer: {
					'@type': 'Answer',
					text: stripMarkdown(item.body)
				}
			}))
		});
		// Split closing tag to prevent parser treating it as end of <script> block
		return `<script type="application/ld+json">${payload}<` + `/script>`;
	});
</script>

<svelte:head>
	{#if jsonLdHtml}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdHtml}
	{/if}
</svelte:head>

<AccordionPrimitive.Root
	class="mb-4 w-full"
	type="multiple"
	value={defaultOpen.map((idx) => `${idx}`)}
>
	{#each items as item, i (i)}
		<Item value={`${i}`} class="border-dark-10 group border-border border-b  px-1.5">
			<Trigger>
				{item.heading}
			</Trigger>

			<Content
				transition={slide}
				transitionConfig={{ duration: 200 }}
				class="pb-[25px] text-sm tracking-[-0.01em]"
			>
				<Markdown markdown={item.body} format />
			</Content>
		</Item>
	{/each}
</AccordionPrimitive.Root>
