<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { slide } from 'svelte/transition';

	import Markdown from '$lib/components/ui/markdown';

	import Content from './accordion-content.svelte';
	import Item from './accordion-item.svelte';
	import Trigger from './accordion-trigger.svelte';

	type Props = {
		items: {
			heading: string;
			body: string;
		}[];
	};
	let { items }: Props = $props();
</script>

<AccordionPrimitive.Root class="mb-4 w-full" multiple>
	{#each items as item, i}
		<Item value="${i}" class="border-dark-10 group border-b px-1.5">
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
